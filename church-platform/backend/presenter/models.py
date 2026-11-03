from django.db import models
import uuid




class BibleTranslation(models.Model):
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(
        max_length=20,
        unique=True
    )

    language = models.CharField(
        max_length=50,
        default="English"
    )

    is_active = models.BooleanField(
        default=True
    )

    is_default = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.abbreviation.upper()


class BibleBook(models.Model):
    name = models.CharField(
        max_length=100
    )

    abbreviation = models.CharField(
        max_length=20,
        blank=True
    )

    book_number = models.PositiveIntegerField()

    testament = models.CharField(
        max_length=20,
        choices=[
            ("old", "Old Testament"),
            ("new", "New Testament"),
        ]
    )

    class Meta:
        ordering = ["book_number"]

    def __str__(self):
        return self.name


class BibleVerse(models.Model):
    translation = models.ForeignKey(
        BibleTranslation,
        on_delete=models.CASCADE,
        related_name="verses"
    )

    book = models.ForeignKey(
        BibleBook,
        on_delete=models.CASCADE,
        related_name="verses"
    )

    chapter = models.PositiveIntegerField()

    verse = models.PositiveIntegerField()

    text = models.TextField()

    class Meta:
        ordering = [
            "book__book_number",
            "chapter",
            "verse",
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "translation",
                    "book",
                    "chapter",
                    "verse",
                ],
                name="unique_bible_verse"
            )
        ]

        indexes = [
            models.Index(
                fields=[
                    "translation",
                    "book",
                    "chapter",
                    "verse",
                ]
            )
        ]

    def __str__(self):
        return (
            f"{self.book.name} "
            f"{self.chapter}:{self.verse} "
            f"({self.translation.abbreviation})"
        )
        
        

class PresenterSession(models.Model):
    name = models.CharField(
        max_length=200,
        default="Main Service"
    )

    session_key = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    current_reference = models.CharField(
        max_length=100,
        blank=True
    )

    current_text = models.TextField(
        blank=True
    )

    current_translation = models.CharField(
        max_length=20,
        blank=True
    )

    background_color = models.CharField(
        max_length=20,
        default="#0b1730"
    )

    reference_color = models.CharField(
        max_length=20,
        default="#ffd447"
    )

    text_color = models.CharField(
        max_length=20,
        default="#ffffff"
    )

    is_live = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name