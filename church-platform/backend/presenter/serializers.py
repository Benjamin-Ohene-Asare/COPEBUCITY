from rest_framework import serializers

from .models import (
    BibleTranslation,
    BibleBook,
    BibleVerse,
)
from .models import PresenterSession
class BibleTranslationSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = BibleTranslation
        fields = (
            "id",
            "name",
            "abbreviation",
            "language",
            "is_default",
        )


class BibleBookSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = BibleBook
        fields = (
            "id",
            "name",
            "abbreviation",
            "book_number",
            "testament",
        )


class BibleVerseSerializer(
    serializers.ModelSerializer
):
    book_name = serializers.CharField(
        source="book.name",
        read_only=True
    )

    translation_name = serializers.CharField(
        source="translation.name",
        read_only=True
    )

    translation_abbreviation = serializers.CharField(
        source="translation.abbreviation",
        read_only=True
    )

    reference = serializers.SerializerMethodField()

    class Meta:
        model = BibleVerse

        fields = (
            "id",
            "book_name",
            "chapter",
            "verse",
            "text",
            "reference",
            "translation_name",
            "translation_abbreviation",
        )

    def get_reference(self, obj):
        return (
            f"{obj.book.name} "
            f"{obj.chapter}:{obj.verse}"
        )
        
        

class PresenterSessionSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = PresenterSession

        fields = (
            "id",
            "name",
            "session_key",
            "current_reference",
            "current_text",
            "current_translation",

            "background_color",
            "reference_color",
            "text_color",

            "is_live",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "session_key",
            "created_at",
            "updated_at",
        )