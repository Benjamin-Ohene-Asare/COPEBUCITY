from urllib.parse import quote
from xml.etree.ElementTree import Element, SubElement, tostring

from django.http import HttpResponse
from django.views.decorators.http import require_GET

from .models import (
    Sermon,
    Event,
    GalleryAlbum,
    Announcement,
    MediaStream,
)


FRONTEND_URL = "https://copebukrom.vercel.app"

PUBLIC_PATHS = [
    "/",
    "/about",
    "/sermons",
    "/watch-live",
    "/document",
    "/events",
    "/gallery",
    "/photo-tag",
    "/announcements",
]


@require_GET
def website_sitemap(request):
    root = Element(
        "urlset",
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9",
    )

    added_urls = set()

    def add_url(path):
        full_url = f"{FRONTEND_URL}{path}"

        if full_url in added_urls:
            return

        added_urls.add(full_url)

        entry = SubElement(root, "url")
        SubElement(entry, "loc").text = full_url

    for path in PUBLIC_PATHS:
        add_url(path)

    content_groups = [
        (
            "/sermons",
            Sermon.objects.filter(is_published=True),
        ),
        (
            "/events",
            Event.objects.filter(is_published=True),
        ),
        (
            "/gallery",
            GalleryAlbum.objects.filter(is_published=True),
        ),
        (
            "/announcements",
            Announcement.objects.filter(is_published=True),
        ),
        (
            "/stream",
            MediaStream.objects.filter(is_active=True),
        ),
    ]

    for prefix, queryset in content_groups:
        slugs = (
            queryset
            .exclude(slug__isnull=True)
            .exclude(slug="")
            .order_by("slug")
            .values_list("slug", flat=True)
        )

        for slug in slugs.iterator(chunk_size=500):
            add_url(f"{prefix}/{quote(str(slug), safe='')}")

    xml_content = tostring(
        root,
        encoding="utf-8",
        xml_declaration=True,
    )

    response = HttpResponse(
        xml_content,
        content_type="application/xml; charset=utf-8",
    )

    # Always reflect the current publication state.
    response["Cache-Control"] = "no-store"
    response["X-Content-Type-Options"] = "nosniff"

    return response