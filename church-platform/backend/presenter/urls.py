from django.urls import path

from . import views


urlpatterns = [
    path(
        "bible/translations/",
        views.bible_translations,
        name="bible-translations"
    ),

    path(
        "bible/books/",
        views.bible_books,
        name="bible-books"
    ),

    path(
        "bible/verses/",
        views.bible_verses,
        name="bible-verses"
    ),
    path(
    "sessions/",
    views.presenter_sessions,
    name="presenter-sessions"
),

path(
    "sessions/<uuid:session_key>/",
    views.presenter_session_detail,
    name="presenter-session-detail"
),

path(
    "sessions/<uuid:session_key>/live/",
    views.presenter_go_live,
    name="presenter-go-live"
),

path(
    "sessions/<uuid:session_key>/clear/",
    views.presenter_clear,
    name="presenter-clear"
),
path(
    "detect-scriptures/",
    views.detect_scriptures,
    name="detect-scriptures"
),
 path(
        "quick-search/",
        views.quick_scripture_search,
        name="quick-scripture-search",
    ),
]