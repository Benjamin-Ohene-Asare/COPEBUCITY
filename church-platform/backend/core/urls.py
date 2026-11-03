from django.urls import path

from . import views

urlpatterns = [
    path(
        "site-settings/",
        views.site_settings,
        name="site-settings"
    ),

    path(
        "hero-slides/",
        views.hero_slides,
        name="hero-slides"
    ),
    path(
    "about/",
    views.about_section,
    name="about"
),

path(
    "ministries/",
    views.ministries,
    name="ministries"
),

path(
    "leaders/",
    views.leaders,
    name="leaders"
),

path(
    "sermon-series/",
    views.sermon_series,
    name="sermon-series"
),

path(
    "sermons/",
    views.sermons,
    name="sermons"
),

path(
    "sermons/<slug:slug>/",
    views.sermon_detail,
    name="sermon-detail"
),

path(
    "streams/",
    views.media_streams,
    name="media-streams"
),

path(
    "streams/<slug:slug>/",
    views.media_stream_detail,
    name="media-stream-detail"
),
path(
    "document-categories/",
    views.document_categories,
    name="document-categories"
),

path(
    "documents/",
    views.documents,
    name="documents"
),

path(
    "events/",
    views.events,
    name="events"
),

path(
    "events/<slug:slug>/",
    views.event_detail,
    name="event-detail"
),

path(
    "gallery/",
    views.gallery_albums,
    name="gallery-albums"
),

path(
    "gallery/<slug:slug>/",
    views.gallery_album_detail,
    name="gallery-album-detail"
),

path(
    "gallery/<slug:slug>/upload/",
    views.gallery_upload,
    name="gallery-upload"
),

path(
    "share/event/<slug:slug>/",
    views.share_event,
    name="share-event"
),

path(
    "share/sermon/<slug:slug>/",
    views.share_sermon,
    name="share-sermon"
),

path(
    "share/gallery/<slug:slug>/",
    views.share_gallery,
    name="share-gallery"
),

path(
    "photo-tags/",
    views.photo_tags,
    name="photo-tags"
),

path(
    "photo-tags/apply/",
    views.apply_photo_tag,
    name="apply-photo-tag"
),
path(
    "announcements/",
    views.announcements,
    name="announcements"
),

path(
    "announcements/<slug:slug>/",
    views.announcement_detail,
    name="announcement-detail"
),

]