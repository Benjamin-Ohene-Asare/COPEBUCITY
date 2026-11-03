import json

from django.core.management.base import BaseCommand

from presenter.models import (
    BibleTranslation,
    BibleBook,
    BibleVerse,
)


BOOKS = [
    ("Genesis", "Gen", "old"),
    ("Exodus", "Exod", "old"),
    ("Leviticus", "Lev", "old"),
    ("Numbers", "Num", "old"),
    ("Deuteronomy", "Deut", "old"),
    ("Joshua", "Josh", "old"),
    ("Judges", "Judg", "old"),
    ("Ruth", "Ruth", "old"),
    ("1 Samuel", "1 Sam", "old"),
    ("2 Samuel", "2 Sam", "old"),
    ("1 Kings", "1 Kgs", "old"),
    ("2 Kings", "2 Kgs", "old"),
    ("1 Chronicles", "1 Chr", "old"),
    ("2 Chronicles", "2 Chr", "old"),
    ("Ezra", "Ezra", "old"),
    ("Nehemiah", "Neh", "old"),
    ("Esther", "Esth", "old"),
    ("Job", "Job", "old"),
    ("Psalms", "Ps", "old"),
    ("Proverbs", "Prov", "old"),
    ("Ecclesiastes", "Eccl", "old"),
    ("Song of Solomon", "Song", "old"),
    ("Isaiah", "Isa", "old"),
    ("Jeremiah", "Jer", "old"),
    ("Lamentations", "Lam", "old"),
    ("Ezekiel", "Ezek", "old"),
    ("Daniel", "Dan", "old"),
    ("Hosea", "Hos", "old"),
    ("Joel", "Joel", "old"),
    ("Amos", "Amos", "old"),
    ("Obadiah", "Obad", "old"),
    ("Jonah", "Jonah", "old"),
    ("Micah", "Mic", "old"),
    ("Nahum", "Nah", "old"),
    ("Habakkuk", "Hab", "old"),
    ("Zephaniah", "Zeph", "old"),
    ("Haggai", "Hag", "old"),
    ("Zechariah", "Zech", "old"),
    ("Malachi", "Mal", "old"),

    ("Matthew", "Matt", "new"),
    ("Mark", "Mark", "new"),
    ("Luke", "Luke", "new"),
    ("John", "John", "new"),
    ("Acts", "Acts", "new"),
    ("Romans", "Rom", "new"),
    ("1 Corinthians", "1 Cor", "new"),
    ("2 Corinthians", "2 Cor", "new"),
    ("Galatians", "Gal", "new"),
    ("Ephesians", "Eph", "new"),
    ("Philippians", "Phil", "new"),
    ("Colossians", "Col", "new"),
    ("1 Thessalonians", "1 Thess", "new"),
    ("2 Thessalonians", "2 Thess", "new"),
    ("1 Timothy", "1 Tim", "new"),
    ("2 Timothy", "2 Tim", "new"),
    ("Titus", "Titus", "new"),
    ("Philemon", "Phlm", "new"),
    ("Hebrews", "Heb", "new"),
    ("James", "Jas", "new"),
    ("1 Peter", "1 Pet", "new"),
    ("2 Peter", "2 Pet", "new"),
    ("1 John", "1 John", "new"),
    ("2 John", "2 John", "new"),
    ("3 John", "3 John", "new"),
    ("Jude", "Jude", "new"),
    ("Revelation", "Rev", "new"),
]


class Command(BaseCommand):
    help = "Import Bible verses from a JSON file"

    def add_arguments(self, parser):
        parser.add_argument(
            "json_file",
            type=str,
            help="Path to Bible JSON file"
        )

        parser.add_argument(
            "--name",
            default="King James Version",
            help="Translation name"
        )

        parser.add_argument(
            "--code",
            default="KJV",
            help="Translation abbreviation"
        )

    def handle(self, *args, **options):

        json_file = options["json_file"]
        translation_name = options["name"]
        translation_code = options["code"]

        self.stdout.write(
            self.style.NOTICE(
                f"Importing {translation_name}..."
            )
        )

        translation, _ = (
            BibleTranslation.objects.get_or_create(
                abbreviation=translation_code,
                defaults={
                    "name": translation_name,
                    "language": "English",
                    "is_active": True,
                    "is_default": True,
                }
            )
        )

        book_objects = {}

        for number, (
            name,
            abbreviation,
            testament
        ) in enumerate(
            BOOKS,
            start=1
        ):

            book, _ = BibleBook.objects.get_or_create(
                book_number=number,
                defaults={
                    "name": name,
                    "abbreviation": abbreviation,
                    "testament": testament,
                }
            )

            book_objects[name.lower()] = book

        with open(
            json_file,
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

        # Full KJV file stores verses inside "verses"
        verses_data = data.get("verses", [])

        imported = 0
        skipped = 0

        for item in verses_data:
            book_name = str(
                item.get("book_name", "")
            ).strip()

            chapter = item.get("chapter")
            verse = item.get("verse")
            text = str(
                item.get("text", "")
            ).strip()

            if (
                not book_name
                or not chapter
                or not verse
                or not text
            ):
                skipped += 1
                continue

            book = book_objects.get(
                book_name.lower()
            )

            if not book:
                self.stdout.write(
                    self.style.WARNING(
                        f"Unknown book: {book_name}"
                    )
                )

                skipped += 1
                continue

            BibleVerse.objects.update_or_create(
                translation=translation,
                book=book,
                chapter=int(chapter),
                verse=int(verse),
                defaults={
                    "text": text
                }
            )

            imported += 1

            if imported % 1000 == 0:
                self.stdout.write(
                    f"{imported} verses processed..."
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Bible import complete. "
                f"{imported} verses imported, "
                f"{skipped} skipped."
            )
        )