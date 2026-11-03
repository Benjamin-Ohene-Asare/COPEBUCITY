from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404


from io import BytesIO

from PIL import Image, ImageOps

from django.http import HttpResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response



from django.core.files.base import ContentFile
from django.http import HttpResponse

from .models import (
    SiteSetting,
    HeroSlide,
    AboutSection,
    Ministry,
    Leader,
    SermonSeries,
    Sermon,
    MediaStream,
    DocumentCategory,
    Document,
    Event,
    GalleryAlbum,
    GalleryImage,
    GallerySubmission,
    PhotoTag,
    Announcement,
)

from .serializers import (
    SiteSettingSerializer,
    HeroSlideSerializer,
    AboutSectionSerializer,
    MinistrySerializer,
    LeaderSerializer,
    SermonSeriesSerializer,
    SermonSerializer,
    MediaStreamSerializer,
    DocumentCategorySerializer,
    DocumentSerializer,
    EventSerializer,
    GalleryAlbumSerializer,
    GalleryImageSerializer,
    GallerySubmissionSerializer,
    PhotoTagSerializer,
    AnnouncementSerializer,
    
)


@api_view(["GET"])
def site_settings(request):
    setting = SiteSetting.objects.first()

    if not setting:
        return Response({})

    serializer = SiteSettingSerializer(setting, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def hero_slides(request):
    slides = HeroSlide.objects.filter(is_active=True).order_by("order")

    serializer = HeroSlideSerializer(slides, many=True, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def about_section(request):
    about = AboutSection.objects.filter(is_active=True).first()

    if not about:
        return Response({})

    serializer = AboutSectionSerializer(about, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def ministries(request):
    items = Ministry.objects.filter(is_active=True).order_by("display_order", "name")

    serializer = MinistrySerializer(items, many=True, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def leaders(request):
    items = Leader.objects.filter(is_active=True).order_by("display_order", "name")

    serializer = LeaderSerializer(items, many=True, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def sermon_series(request):
    series = SermonSeries.objects.filter(is_active=True)

    serializer = SermonSeriesSerializer(series, many=True, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def sermons(request):
    items = (
        Sermon.objects.filter(is_published=True)
        .select_related("series")
        .prefetch_related("insights")
    )

    serializer = SermonSerializer(items, many=True, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def sermon_detail(request, slug):
    try:
        sermon = (
            Sermon.objects.select_related("series")
            .prefetch_related("insights")
            .get(slug=slug, is_published=True)
        )

    except Sermon.DoesNotExist:
        return Response({"detail": "Sermon not found."}, status=404)

    serializer = SermonSerializer(sermon, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def media_streams(request):
    streams = MediaStream.objects.filter(is_active=True).order_by(
        "-is_live", "-published_at", "-created_at"
    )

    serializer = MediaStreamSerializer(streams, many=True, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def media_stream_detail(request, slug):
    try:
        stream = MediaStream.objects.get(slug=slug, is_active=True)

    except MediaStream.DoesNotExist:
        return Response({"detail": "Stream not found."}, status=404)

    serializer = MediaStreamSerializer(stream, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def document_categories(request):
    categories = DocumentCategory.objects.filter(is_active=True).order_by("name")

    serializer = DocumentCategorySerializer(
        categories, many=True, context={"request": request}
    )

    return Response(serializer.data)


@api_view(["GET"])
def documents(request):
    items = Document.objects.filter(is_published=True).select_related("category")

    serializer = DocumentSerializer(items, many=True, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def events(request):
    items = Event.objects.filter(is_published=True).order_by("start_date", "start_time")

    serializer = EventSerializer(items, many=True, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def event_detail(request, slug):
    try:
        event = Event.objects.get(slug=slug, is_published=True)

    except Event.DoesNotExist:
        return Response({"detail": "Event not found."}, status=404)

    serializer = EventSerializer(event, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def gallery_albums(request):
    albums = GalleryAlbum.objects.filter(is_published=True).prefetch_related("images")

    serializer = GalleryAlbumSerializer(albums, many=True, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
def gallery_album_detail(request, slug):
    try:
        album = GalleryAlbum.objects.prefetch_related("images").get(
            slug=slug, is_published=True
        )

    except GalleryAlbum.DoesNotExist:
        return Response({"detail": "Gallery album not found."}, status=404)

    serializer = GalleryAlbumSerializer(album, context={"request": request})

    data = serializer.data

    # Only send published photos publicly
    data["images"] = GalleryImageSerializer(
        album.images.filter(is_published=True), many=True, context={"request": request}
    ).data

    return Response(data)


@api_view(["POST"])
def gallery_upload(request, slug):
    try:
        album = GalleryAlbum.objects.get(slug=slug, is_published=True)

    except GalleryAlbum.DoesNotExist:
        return Response({"detail": "Gallery album not found."}, status=404)

    if not album.allow_public_upload:
        return Response(
            {"detail": "Public uploads are not allowed for this album."}, status=403
        )

    image = request.FILES.get("image")

    if not image:
        return Response({"detail": "Please select an image."}, status=400)

    submission = GallerySubmission.objects.create(
        album=album,
        name=request.data.get("name", ""),
        caption=request.data.get("caption", ""),
        image=image,
        status="pending",
    )

    serializer = GallerySubmissionSerializer(submission, context={"request": request})

    return Response(serializer.data, status=201)


def share_event(request, slug):

    event = get_object_or_404(Event, slug=slug, is_published=True)

    frontend_url = f"http://localhost:5173/events/{event.slug}"

    image = ""

    if event.image:
        image = request.build_absolute_uri(event.image.url)

    return render(
        request,
        "share_preview.html",
        {
            "title": event.title,
            "description": event.short_description
            or event.description
            or "View this event from Ebukrom District.",
            "image": image,
            "share_url": request.build_absolute_uri(),
            "frontend_url": frontend_url,
        },
    )


def share_sermon(request, slug):

    sermon = get_object_or_404(Sermon, slug=slug, is_published=True)

    frontend_url = f"http://localhost:5173/sermons/{sermon.slug}"

    image = ""

    if sermon.thumbnail:
        image = request.build_absolute_uri(sermon.thumbnail.url)

    return render(
        request,
        "share_preview.html",
        {
            "title": sermon.title,
            "description": sermon.short_description
            or sermon.scripture
            or "Listen to this message from Ebukrom District.",
            "image": image,
            "share_url": request.build_absolute_uri(),
            "frontend_url": frontend_url,
        },
    )


def share_gallery(request, slug):

    album = get_object_or_404(GalleryAlbum, slug=slug, is_published=True)

    frontend_url = f"http://localhost:5173/gallery/{album.slug}"

    image = ""

    if album.cover_image:

        image = request.build_absolute_uri(album.cover_image.url)

    else:

        first_image = album.images.filter(is_published=True).first()

        if first_image:
            image = request.build_absolute_uri(first_image.image.url)

    return render(
        request,
        "share_preview.html",
        {
            "title": album.title,
            "description": album.description or "View photos from Ebukrom District.",
            "image": image,
            "share_url": request.build_absolute_uri(),
            "frontend_url": frontend_url,
        },
    )


@api_view(["GET"])
def photo_tags(request):
    tags = PhotoTag.objects.filter(is_active=True)

    serializer = PhotoTagSerializer(tags, many=True, context={"request": request})

    return Response(serializer.data)




@api_view(["POST"])
def apply_photo_tag(request):
    photo = request.FILES.get("photo")
    tag_id = request.data.get("tag_id")
    position = request.data.get(
        "position",
        "bottom-center"
    )

    # VALIDATION
    if not photo:
        return Response(
            {
                "detail": "Please upload a photo."
            },
            status=400
        )

    if not tag_id:
        return Response(
            {
                "detail": "Please select a photo tag."
            },
            status=400
        )

    allowed_positions = [
        "bottom-left",
        "bottom-center",
        "bottom-right",
    ]

    if position not in allowed_positions:
        return Response(
            {
                "detail": "Invalid tag position."
            },
            status=400
        )

    try:
        photo_tag = PhotoTag.objects.get(
            id=tag_id,
            is_active=True
        )
    except PhotoTag.DoesNotExist:
        return Response(
            {
                "detail": "Photo tag not found."
            },
            status=404
        )

    try:
        # OPEN MAIN PHOTO
        base_image = Image.open(photo)

        base_image = ImageOps.exif_transpose(
            base_image
        )

        base_image = base_image.convert("RGBA")

        # OPEN PNG TAG
        tag_image = Image.open(
            photo_tag.png_file.path
        ).convert("RGBA")

        photo_width, photo_height = (
            base_image.size
        )

        tag_width, tag_height = (
            tag_image.size
        )

        # Resize tag to 40% of photo width
        target_tag_width = int(
            photo_width * 0.40
        )

        scale = (
            target_tag_width / tag_width
        )

        target_tag_height = int(
            tag_height * scale
        )

        tag_image = tag_image.resize(
            (
                target_tag_width,
                target_tag_height,
            ),
            Image.Resampling.LANCZOS
        )

        # POSITION
        padding = 10

        y = (
            photo_height
            - target_tag_height
            - padding
        )

        if position == "bottom-left":
            x = padding

        elif position == "bottom-right":
            x = (
                photo_width
                - target_tag_width
                - padding
            )

        else:
            x = (
                photo_width
                - target_tag_width
            ) // 2

        # APPLY TAG
        base_image.alpha_composite(
            tag_image,
            (x, y)
        )

        # CONVERT TO JPEG
        final_image = base_image.convert(
            "RGB"
        )

        output = BytesIO()

        final_image.save(
            output,
            format="JPEG",
            quality=95,
            optimize=True
        )

        output.seek(0)

        original_name = (
            photo.name.rsplit(".", 1)[0]
        )

        filename = (
            f"{original_name}-tagged.jpg"
        )

        response = HttpResponse(
            output.getvalue(),
            content_type="image/jpeg"
        )

        response["Content-Disposition"] = (
            f'attachment; filename="{filename}"'
        )

        return response

    except Exception as error:
        print(
            "PHOTO TAG ERROR:",
            error
        )

        return Response(
            {
                "detail":
                "Unable to process the uploaded photo."
            },
            status=400
        )


@api_view(["GET"])
def announcements(request):

    items = Announcement.objects.filter(
        is_published=True
    )

    serializer = AnnouncementSerializer(
        items,
        many=True,
        context={
            "request": request
        }
    )

    return Response(
        serializer.data
    )

@api_view(["GET"])
def announcement_detail(
    request,
    slug
):

    try:
        announcement = (
            Announcement.objects.get(
                slug=slug,
                is_published=True
            )
        )

    except Announcement.DoesNotExist:

        return Response(
            {
                "detail":
                "Announcement not found."
            },
            status=404
        )


    serializer = AnnouncementSerializer(
        announcement,
        context={
            "request": request
        }
    )

    return Response(
        serializer.data
    )