import re


BOOK_ALIASES = {
    "gen": "Genesis",
    "ge": "Genesis",
    "gn": "Genesis",

    "exo": "Exodus",
    "ex": "Exodus",

    "ps": "Psalms",
    "psa": "Psalms",
    "psalm": "Psalms",

    "mt": "Matthew",
    "matt": "Matthew",

    "mk": "Mark",
    "mrk": "Mark",

    "lk": "Luke",

    "jn": "John",
    "jhn": "John",
    "j": "John",

    "act": "Acts",

    "rom": "Romans",
    "ro": "Romans",

    "1cor": "1 Corinthians",
    "1 cor": "1 Corinthians",
    "first corinthians": "1 Corinthians",

    "2cor": "2 Corinthians",
    "2 cor": "2 Corinthians",
    "second corinthians": "2 Corinthians",

    "gal": "Galatians",

    "eph": "Ephesians",

    "phil": "Philippians",

    "col": "Colossians",

    "1thess": "1 Thessalonians",
    "1 thess": "1 Thessalonians",

    "2thess": "2 Thessalonians",
    "2 thess": "2 Thessalonians",

    "heb": "Hebrews",

    "jas": "James",

    "1pet": "1 Peter",
    "1 pet": "1 Peter",

    "2pet": "2 Peter",
    "2 pet": "2 Peter",

    "1jn": "1 John",
    "1 jn": "1 John",

    "2jn": "2 John",
    "2 jn": "2 John",

    "3jn": "3 John",
    "3 jn": "3 John",

    "rev": "Revelation",
    # ==============================
# NUMBERED OLD TESTAMENT BOOKS
# ==============================

"1 sam": "1 Samuel",
"1sam": "1 Samuel",
"1 sm": "1 Samuel",
"1sm": "1 Samuel",

"2 sam": "2 Samuel",
"2sam": "2 Samuel",
"2 sm": "2 Samuel",
"2sm": "2 Samuel",

"1 ki": "1 Kings",
"1ki": "1 Kings",
"1 kings": "1 Kings",
"1kings": "1 Kings",

"2 ki": "2 Kings",
"2ki": "2 Kings",
"2 kings": "2 Kings",
"2kings": "2 Kings",

"1 chr": "1 Chronicles",
"1chr": "1 Chronicles",
"1 ch": "1 Chronicles",
"1ch": "1 Chronicles",

"2 chr": "2 Chronicles",
"2chr": "2 Chronicles",
"2 ch": "2 Chronicles",
"2ch": "2 Chronicles",


# ==============================
# NUMBERED NEW TESTAMENT BOOKS
# ==============================

"1 cor": "1 Corinthians",
"1cor": "1 Corinthians",
"1 co": "1 Corinthians",
"1co": "1 Corinthians",

"2 cor": "2 Corinthians",
"2cor": "2 Corinthians",
"2 co": "2 Corinthians",
"2co": "2 Corinthians",

"1 thess": "1 Thessalonians",
"1thess": "1 Thessalonians",
"1 thes": "1 Thessalonians",
"1thes": "1 Thessalonians",

"2 thess": "2 Thessalonians",
"2thess": "2 Thessalonians",
"2 thes": "2 Thessalonians",
"2thes": "2 Thessalonians",

"1 tim": "1 Timothy",
"1tim": "1 Timothy",
"1 tm": "1 Timothy",
"1tm": "1 Timothy",

"2 tim": "2 Timothy",
"2tim": "2 Timothy",
"2 tm": "2 Timothy",
"2tm": "2 Timothy",

"1 pet": "1 Peter",
"1pet": "1 Peter",
"1 pe": "1 Peter",
"1pe": "1 Peter",

"2 pet": "2 Peter",
"2pet": "2 Peter",
"2 pe": "2 Peter",
"2pe": "2 Peter",

"1 john": "1 John",
"1john": "1 John",
"1 jn": "1 John",
"1jn": "1 John",

"2 john": "2 John",
"2john": "2 John",
"2 jn": "2 John",
"2jn": "2 John",

"3 john": "3 John",
"3john": "3 John",
"3 jn": "3 John",
"3jn": "3 John",
}


NUMBER_WORDS = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
    "thirty": 30,
    "forty": 40,
    "fifty": 50,
    "sixty": 60,
    "seventy": 70,
    "eighty": 80,
    "ninety": 90,
}


def words_to_numbers(text):
    words = text.lower().split()

    output = []
    current = 0
    building_number = False

    for word in words:

        if word in NUMBER_WORDS:
            value = NUMBER_WORDS[word]

            if value >= 20:
                current += value
            else:
                current += value

            building_number = True

        else:

            if building_number:
                output.append(
                    str(current)
                )

                current = 0
                building_number = False

            output.append(word)

    if building_number:
        output.append(
            str(current)
        )

    return " ".join(output)


def normalize_query(query):
    query = query.lower().strip()

    query = words_to_numbers(
        query
    )

    query = query.replace(
        "chapter",
        " "
    )

    query = query.replace(
        "verses",
        " "
    )

    query = query.replace(
        "verse",
        " "
    )

    query = query.replace(
        ":",
        " "
    )

    query = re.sub(
        r"\s+",
        " ",
        query
    ).strip()

    return query


def parse_reference(
    query,
    current_book=None,
    current_chapter=None,
):
    """
    Examples:

    j 14 6
    jn 3 16
    john 3 16
    john3:16
    rom 8 28
    ps 23
    1 cor 13 4

    If current context is John 14:
    7       -> John 14:7
    8-10    -> John 14:8-10
    """

    raw = query.strip()

    if not raw:
        return None


    # =====================================
    # CURRENT CHAPTER SHORTCUT
    # =====================================

    if (
        current_book and
        current_chapter
    ):
        verse_match = re.fullmatch(
            r"(\d+)(?:\s*-\s*(\d+))?",
            raw
        )

        if verse_match:
            start_verse = int(
                verse_match.group(1)
            )

            end_verse = (
                int(
                    verse_match.group(2)
                )
                if verse_match.group(2)
                else None
            )

            return {
                "book":
                    current_book,

                "chapter":
                    int(current_chapter),

                "verse":
                    start_verse,

                "end_verse":
                    end_verse,
            }


    normalized = normalize_query(
        raw
    )


    # Handle john316
    compact_match = re.fullmatch(
        r"([a-z]+)(\d{1,3})(\d{1,3})",
        normalized
    )

    if compact_match:
        alias = compact_match.group(1)

        if alias in BOOK_ALIASES:
            return {
                "book":
                    BOOK_ALIASES[alias],

                "chapter":
                    int(
                        compact_match.group(2)
                    ),

                "verse":
                    int(
                        compact_match.group(3)
                    ),

                "end_verse":
                    None,
            }


    # Sort aliases longest first
    aliases = sorted(
        BOOK_ALIASES.keys(),
        key=len,
        reverse=True
    )


    for alias in aliases:

        if not normalized.startswith(
            alias
        ):
            continue


        remainder = (
            normalized[
                len(alias):
            ]
            .strip()
        )


        numbers = re.findall(
            r"\d+",
            remainder
        )


        if not numbers:
            continue


        book = BOOK_ALIASES[
            alias
        ]


        # Example:
        # ps 23
        if len(numbers) == 1:
            return {
                "book":
                    book,

                "chapter":
                    int(numbers[0]),

                "verse":
                    None,

                "end_verse":
                    None,
            }


        chapter = int(
            numbers[0]
        )

        verse = int(
            numbers[1]
        )


        end_verse = None

        range_match = re.search(
            r"(\d+)\s*-\s*(\d+)",
            remainder
        )

        if range_match:
            verse = int(
                range_match.group(1)
            )

            end_verse = int(
                range_match.group(2)
            )


        return {
            "book":
                book,

            "chapter":
                chapter,

            "verse":
                verse,

            "end_verse":
                end_verse,
        }


    return None 