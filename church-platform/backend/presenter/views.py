from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    BibleTranslation,
    BibleBook,
    BibleVerse,
)
from .services.detector import (
    detect_scripture_references,
)


from .serializers import (
    BibleTranslationSerializer,
    BibleBookSerializer,
    BibleVerseSerializer,
)

from asgiref.sync import async_to_sync

from channels.layers import (
    get_channel_layer,
)

from .models import PresenterSession

from .serializers import (
    PresenterSessionSerializer,
)


from .services.reference_parser import (
    parse_reference,
)



@api_view(["GET"])
def bible_translations(request):
    translations = (
        BibleTranslation.objects
        .filter(is_active=True)
    )

    serializer = BibleTranslationSerializer(
        translations,
        many=True
    )

    return Response(serializer.data)


@api_view(["GET"])
def bible_books(request):
    books = BibleBook.objects.all()

    serializer = BibleBookSerializer(
        books,
        many=True
    )

    return Response(serializer.data)


@api_view(["GET"])
def bible_verses(request):
    book_name = request.GET.get("book")
    chapter = request.GET.get("chapter")
    verse = request.GET.get("verse")
    translation_code = request.GET.get(
        "translation"
    )

    if not book_name or not chapter:
        return Response(
            {
                "detail":
                "Book and chapter are required."
            },
            status=400
        )

    try:
        book = BibleBook.objects.get(
            name__iexact=book_name
        )
    except BibleBook.DoesNotExist:
        return Response(
            {
                "detail": "Bible book not found."
            },
            status=404
        )

    # Translation selected by user
    if translation_code:
        try:
            translation = (
                BibleTranslation.objects.get(
                    abbreviation__iexact=
                    translation_code,
                    is_active=True
                )
            )
        except BibleTranslation.DoesNotExist:
            return Response(
                {
                    "detail":
                    "Bible translation not found."
                },
                status=404
            )

    else:
        # Use default translation
        translation = (
            BibleTranslation.objects
            .filter(
                is_default=True,
                is_active=True
            )
            .first()
        )

        # Fallback
        if not translation:
            translation = (
                BibleTranslation.objects
                .filter(is_active=True)
                .first()
            )

    if not translation:
        return Response(
            {
                "detail":
                "No Bible translation is available."
            },
            status=404
        )

    verses = BibleVerse.objects.filter(
        translation=translation,
        book=book,
        chapter=chapter,
    )

    # Specific verse
    if verse:
        verses = verses.filter(
            verse=verse
        )

    verses = verses.order_by("verse")

    serializer = BibleVerseSerializer(
        verses,
        many=True
    )

    return Response(
        {
            "book": book.name,
            "chapter": int(chapter),
            "translation":
                translation.abbreviation,
            "verses": serializer.data,
        }
    )
    
    
    
@api_view(["GET", "POST"])
def presenter_sessions(request):

    if request.method == "GET":

        sessions = (
            PresenterSession.objects
            .all()
            .order_by("-created_at")
        )

        serializer = (
            PresenterSessionSerializer(
                sessions,
                many=True
            )
        )

        return Response(
            serializer.data
        )


    serializer = (
        PresenterSessionSerializer(
            data=request.data
        )
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=201
        )

    return Response(
        serializer.errors,
        status=400
    )
    
    
@api_view(["GET"])
def presenter_session_detail(
    request,
    session_key
):

    try:
        session = (
            PresenterSession.objects
            .get(
                session_key=session_key
            )
        )

    except PresenterSession.DoesNotExist:

        return Response(
            {
                "detail":
                "Presenter session not found."
            },
            status=404
        )


    serializer = PresenterSessionSerializer(
        session
    )

    return Response(
        serializer.data
    )  
    
    
    

@api_view(["POST"])
def presenter_go_live(
    request,
    session_key
):

    try:
        session = (
            PresenterSession.objects
            .get(
                session_key=session_key
            )
        )

    except PresenterSession.DoesNotExist:

        return Response(
            {
                "detail":
                "Presenter session not found."
            },
            status=404
        )


    reference = request.data.get(
        "reference",
        ""
    )

    text = request.data.get(
        "text",
        ""
    )

    translation = request.data.get(
        "translation",
        "KJV"
    )
    theme = request.data.get(
        "theme",
        {}
    )

    background_color = theme.get(
        "background",
        "#0b1730"
    )

    reference_color = theme.get(
        "reference",
        "#ffd447"
    )

    text_color = theme.get(
        "text",
        "#ffffff"
    )

    if not reference or not text:

        return Response(
            {
                "detail":
                "Reference and verse text are required."
            },
            status=400
        )


    session.current_reference = reference
    session.current_text = text
    session.current_translation = translation
    session.is_live = True

    session.save(
        update_fields=[
            "current_reference",
            "current_text",
            "current_translation",
            "is_live",
            "updated_at",
        ]
    )


    payload = {
    "action": "show",

    "reference": reference,
    "text": text,
    "translation": translation,

    "theme": {
        "background": background_color,
        "reference": reference_color,
        "text": text_color,
    },
}


    channel_layer = (
        get_channel_layer()
    )


    async_to_sync(
        channel_layer.group_send
    )(
        f"presenter_{session_key}",
        {
            "type":
                "presenter_message",

            "payload":
                payload,
        }
    )


    return Response(
        {
            "success": True,
            **payload,
        }
    )  
    
    
    
@api_view(["POST"])
def presenter_clear(
    request,
    session_key
):

    try:
        session = (
            PresenterSession.objects
            .get(
                session_key=session_key
            )
        )

    except PresenterSession.DoesNotExist:

        return Response(
            {
                "detail":
                "Presenter session not found."
            },
            status=404
        )


    session.is_live = False

    session.save(
        update_fields=[
            "is_live",
            "updated_at",
        ]
    )


    payload = {
        "action": "clear"
    }


    channel_layer = (
        get_channel_layer()
    )


    async_to_sync(
        channel_layer.group_send
    )(
        f"presenter_{session_key}",
        {
            "type":
                "presenter_message",

            "payload":
                payload,
        }
    )


    return Response(
        {
            "success": True,
            "action": "clear",
        }
    )   
    
    
    
@api_view(["POST"])
def detect_scriptures(request):

    transcript = request.data.get(
        "transcript",
        ""
    )

    translation = request.data.get(
        "translation",
        "KJV"
    )

    if not transcript.strip():
        return Response(
            {
                "detections": []
            }
        )

    detections = (
        detect_scripture_references(
            transcript,
            translation
        )
    )

    return Response({
        "transcript":
            transcript,

        "detections":
            detections,
    })  
    
    
    
@api_view(["POST"])
def quick_scripture_search(request):
    query = request.data.get(
        "query",
        ""
    )

    translation_code = request.data.get(
        "translation",
        "KJV"
    )

    current_book = request.data.get(
        "current_book"
    )

    current_chapter = request.data.get(
        "current_chapter"
    )

    parsed = parse_reference(
        query,
        current_book=current_book,
        current_chapter=current_chapter,
    )

    if not parsed:
        return Response({
            "match": None,
            "verses": [],
        })

    translation = (
        BibleTranslation.objects
        .filter(
            abbreviation__iexact=
                translation_code
        )
        .first()
    )

    if not translation:
        return Response(
            {
                "detail":
                    "Translation not found."
            },
            status=404
        )

    verses = (
        BibleVerse.objects
        .filter(
            translation=translation,
            book__name__iexact=
                parsed["book"],
            chapter=
                parsed["chapter"],
        )
        .order_by("verse")
    )

    if parsed["verse"]:

        if parsed["end_verse"]:

            verses = verses.filter(
                verse__gte=
                    parsed["verse"],
                verse__lte=
                    parsed["end_verse"],
            )

        else:

            verses = verses.filter(
                verse=
                    parsed["verse"]
            )

    serializer = BibleVerseSerializer(
        verses,
        many=True
    )

    return Response({
        "match": parsed,
        "verses": serializer.data,
    })              