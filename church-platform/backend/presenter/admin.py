from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import PresenterSession
from .models import (
    BibleTranslation,
    BibleBook,
    BibleVerse,
)


@admin.register(BibleTranslation)
class BibleTranslationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "abbreviation",
        "language",
        "is_default",
        "is_active",
    )

    list_editable = (
        "is_default",
        "is_active",
    )

    search_fields = (
        "name",
        "abbreviation",
    )


@admin.register(BibleBook)
class BibleBookAdmin(admin.ModelAdmin):
    list_display = (
        "book_number",
        "name",
        "abbreviation",
        "testament",
    )

    list_filter = (
        "testament",
    )

    search_fields = (
        "name",
        "abbreviation",
    )


@admin.register(BibleVerse)
class BibleVerseAdmin(admin.ModelAdmin):
    list_display = (
        "book",
        "chapter",
        "verse",
        "translation",
        "short_text",
    )

    list_filter = (
        "translation",
        "book",
    )

    search_fields = (
        "text",
        "book__name",
    )

    def short_text(self, obj):
        if len(obj.text) > 80:
            return obj.text[:80] + "..."

        return obj.text
    
    

@admin.register(PresenterSession)
class PresenterSessionAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "session_key",
        "is_live",
        "updated_at",
    )

    readonly_fields = (
        "session_key",
        "created_at",
        "updated_at",
    )   