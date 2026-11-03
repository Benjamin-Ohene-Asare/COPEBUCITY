import re

from presenter.models import (
    BibleBook,
    BibleTranslation,
    BibleVerse,
)


BOOK_ALIASES = {
    "gen": "Genesis",
    "genesis": "Genesis",

    "exo": "Exodus",
    "exodus": "Exodus",

    "psalm": "Psalms",
    "psalms": "Psalms",
    "ps": "Psalms",

    "matthew": "Matthew",
    "matt": "Matthew",

    "mark": "Mark",

    "luke": "Luke",

    "john": "John",
    "jn": "John",

    "acts": "Acts",

    "romans": "Romans",
    "rom": "Romans",

    "galatians": "Galatians",
    "gal": "Galatians",

    "ephesians": "Ephesians",
    "eph": "Ephesians",

    "philippians": "Philippians",
    "phil": "Philippians",

    "colossians": "Colossians",
    "col": "Colossians",

    "hebrews": "Hebrews",
    "heb": "Hebrews",

    "james": "James",

    "revelation": "Revelation",
    "rev": "Revelation",
}


NUMBERED_BOOKS = {
    "first": "1",
    "second": "2",
    "third": "3",
    "1st": "1",
    "2nd": "2",
    "3rd": "3",
}


def normalize_spoken_reference(text):
    text = text.lower().strip()

    text = text.replace(
        "chapter",
        " "
    )

    text = text.replace(
        "verse",
        " "
    )

    text = text.replace(
        "verses",
        " "
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text


def get_translation(code="KJV"):
    translation = (
        BibleTranslation.objects
        .filter(
            abbreviation__iexact=code,
            is_active=True,
        )
        .first()
    )

    if translation:
        return translation

    return (
        BibleTranslation.objects
        .filter(
            is_default=True,
            is_active=True,
        )
        .first()
    )


def detect_scripture_references(
    transcript,
    translation_code="KJV"
):
    """
    Examples detected:

    John 3:16
    John chapter 3 verse 16
    Romans 8 28
    First Corinthians 13 verse 4
    1 Corinthians 13:4
    """

    if not transcript:
        return []

    original_text = transcript

    normalized = (
        normalize_spoken_reference(
            transcript
        )
    )

    translation = get_translation(
        translation_code
    )

    if not translation:
        return []

    results = []

    books = list(
        BibleBook.objects.all()
    )

    candidates = []

    for book in books:
        names = {
            book.name.lower()
        }

        if book.abbreviation:
            names.add(
                book.abbreviation.lower()
            )

        # Support:
        # 1 Corinthians
        # first Corinthians
        parts = book.name.split(
            " ",
            1
        )

        if (
            len(parts) == 2
            and parts[0] in {
                "1",
                "2",
                "3",
            }
        ):
            number = parts[0]
            base_name = parts[1]

            word_number = {
                "1": "first",
                "2": "second",
                "3": "third",
            }[number]

            ordinal_number = {
                "1": "1st",
                "2": "2nd",
                "3": "3rd",
            }[number]

            names.add(
                f"{word_number} {base_name.lower()}"
            )

            names.add(
                f"{ordinal_number} {base_name.lower()}"
            )

        for name in names:
            candidates.append(
                (
                    name,
                    book
                )
            )

    # Longest names first:
    # "1 Corinthians" before "Corinthians"
    candidates.sort(
        key=lambda item:
        len(item[0]),
        reverse=True
    )

    seen = set()

    for spoken_book, book in candidates:

        escaped_book = re.escape(
            spoken_book
        )

        patterns = [
            # John 3:16
            rf"\b{escaped_book}\s+(\d+)\s*:\s*(\d+)\b",

            # John 3 16
            rf"\b{escaped_book}\s+(\d+)\s+(\d+)\b",

            # after removing words:
            # "john chapter 3 verse 16"
            # becomes "john 3 16"
            rf"\b{escaped_book}\s+(\d+)\s+(\d+)\b",
        ]

        for pattern in patterns:

            matches = re.finditer(
                pattern,
                normalized
            )

            for match in matches:

                chapter = int(
                    match.group(1)
                )

                verse_number = int(
                    match.group(2)
                )

                key = (
                    book.id,
                    chapter,
                    verse_number,
                )

                if key in seen:
                    continue

                seen.add(key)

                bible_verse = (
                    BibleVerse.objects
                    .filter(
                        translation=
                            translation,
                        book=book,
                        chapter=chapter,
                        verse=verse_number,
                    )
                    .first()
                )

                if not bible_verse:
                    continue

                results.append({
                    "id":
                        bible_verse.id,

                    "book_name":
                        book.name,

                    "chapter":
                        chapter,

                    "verse":
                        verse_number,

                    "reference":
                        (
                            f"{book.name} "
                            f"{chapter}:"
                            f"{verse_number}"
                        ),

                    "text":
                        bible_verse.text,

                    "translation_abbreviation":
                        translation.abbreviation,

                    "source":
                        original_text,

                    "confidence":
                        1.0,
                })

    return results