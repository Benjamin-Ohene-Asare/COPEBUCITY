from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.utils import timezone

from .models import (
    SiteSetting,
    HeroSlide,
    AboutSection,
    Ministry,
    Leader,
    SermonSeries,
    Sermon,
    SermonInsight,
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


# =========================================
# SITE SETTINGS
# =========================================

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = (
        "church_name",
        "phone",
        "location",
        "updated_at",
    )

    fieldsets = (
        (
            "Church Information",
            {
                "fields": (
                    "church_name",
                    "logo",
                    "phone",
                    "location",
                )
            },
        ),
        (
            "Social Media",
            {
                "fields": (
                    "facebook_url",
                    "youtube_url",
                    "instagram_url",
                    "tiktok_url",
                )
            },
        ),
    )


# =========================================
# HERO SLIDES
# =========================================

@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "small_title",
        "order",
        "is_active",
        "updated_at",
    )

    list_editable = (
        "order",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "title",
        "small_title",
    )

    ordering = ("order",)


# =========================================
# ABOUT
# =========================================

@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "is_active",
        "updated_at",
    )

    list_editable = (
        "is_active",
    )


# =========================================
# MINISTRIES
# =========================================

@admin.register(Ministry)
class MinistryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "display_order",
        "is_active",
    )

    list_editable = (
        "display_order",
        "is_active",
    )

    search_fields = (
        "name",
    )

    prepopulated_fields = {
        "slug": ("name",)
    }


# =========================================
# LEADERS
# =========================================

@admin.register(Leader)
class LeaderAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "title",
        "leader_type",
        "ministry",
        "is_current",
        "is_active",
        "display_order",
    )

    list_editable = (
        "is_current",
        "is_active",
        "display_order",
    )

    list_filter = (
        "leader_type",
        "is_current",
        "is_active",
        "ministry",
    )

    search_fields = (
        "name",
        "spouse_name",
        "title",
    )


# =========================================
# SERMON SERIES
# =========================================

@admin.register(SermonSeries)
class SermonSeriesAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "created_at",
    )

    list_editable = (
        "is_active",
    )

    search_fields = (
        "name",
    )

    prepopulated_fields = {
        "slug": ("name",)
    }


# =========================================
# SERMON INSIGHTS INLINE
# =========================================

class SermonInsightInline(admin.TabularInline):
    model = SermonInsight

    extra = 1

    fields = (
        "text",
        "order",
    )

    ordering = (
        "order",
    )


# =========================================
# SERMONS
# =========================================

@admin.register(Sermon)
class SermonAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "preacher",
        "series",
        "sermon_date",
        "is_featured",
        "is_published",
    )

    list_editable = (
        "is_featured",
        "is_published",
    )

    list_filter = (
        "series",
        "sermon_date",
        "is_featured",
        "is_published",
    )

    search_fields = (
        "title",
        "preacher",
        "scripture",
        "topic",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    date_hierarchy = "sermon_date"

    inlines = [
        SermonInsightInline
    ]


# =========================================
# MEDIA STREAMS
# =========================================

@admin.register(MediaStream)
class MediaStreamAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "platform",
        "stream_type",
        "is_live",
        "is_featured",
        "is_active",
        "published_at",
    )

    list_editable = (
        "is_live",
        "is_featured",
        "is_active",
    )

    list_filter = (
        "platform",
        "stream_type",
        "is_live",
        "is_active",
    )

    search_fields = (
        "title",
        "channel_name",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }


# =========================================
# DOCUMENT CATEGORIES
# =========================================

@admin.register(DocumentCategory)
class DocumentCategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "created_at",
    )

    list_editable = (
        "is_active",
    )

    prepopulated_fields = {
        "slug": ("name",)
    }


# =========================================
# DOCUMENTS
# =========================================

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "published_date",
        "is_featured",
        "is_published",
    )

    list_editable = (
        "is_featured",
        "is_published",
    )

    list_filter = (
        "category",
        "is_featured",
        "is_published",
    )

    search_fields = (
        "title",
        "description",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    date_hierarchy = "published_date"


# =========================================
# EVENTS
# =========================================

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "start_date",
        "start_time",
        "venue",
        "is_featured",
        "is_published",
    )

    list_editable = (
        "is_featured",
        "is_published",
    )

    list_filter = (
        "start_date",
        "is_featured",
        "is_published",
    )

    search_fields = (
        "title",
        "venue",
        "organizer",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    date_hierarchy = "start_date"


# =========================================
# GALLERY IMAGES INLINE
# =========================================

class GalleryImageInline(admin.TabularInline):
    model = GalleryImage

    extra = 1

    fields = (
        "image",
        "caption",
        "uploaded_by",
        "display_order",
        "is_published",
    )

    ordering = (
        "display_order",
    )


# =========================================
# GALLERY ALBUMS
# =========================================

@admin.register(GalleryAlbum)
class GalleryAlbumAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "event_date",
        "allow_public_upload",
        "is_published",
        "display_order",
    )

    list_editable = (
        "allow_public_upload",
        "is_published",
        "display_order",
    )

    list_filter = (
        "allow_public_upload",
        "is_published",
        "event_date",
    )

    search_fields = (
        "title",
        "description",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    inlines = [
        GalleryImageInline
    ]


# =========================================
# GALLERY IMAGES
# =========================================

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = (
        "album",
        "caption",
        "uploaded_by",
        "display_order",
        "is_published",
        "created_at",
    )

    list_editable = (
        "display_order",
        "is_published",
    )

    list_filter = (
        "album",
        "is_published",
    )

    search_fields = (
        "album__title",
        "caption",
        "uploaded_by",
    )


# =========================================
# GALLERY SUBMISSIONS
# =========================================
@admin.register(GallerySubmission)
class GallerySubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "album",
        "name",
        "status",
        "created_at",
        "reviewed_at",
    )

    list_filter = (
        "status",
        "album",
        "created_at",
    )

    search_fields = (
        "name",
        "caption",
        "album__title",
    )

    readonly_fields = (
        "created_at",
        "reviewed_at",
    )

    actions = (
        "approve_submissions",
        "reject_submissions",
    )


    def publish_submission(self, submission):
        already_exists = GalleryImage.objects.filter(
            album=submission.album,
            image=submission.image.name,
        ).exists()

        if not already_exists:
            GalleryImage.objects.create(
                album=submission.album,
                image=submission.image,
                caption=submission.caption,
                uploaded_by=submission.name,
                is_published=True,
            )


    def save_model(
        self,
        request,
        obj,
        form,
        change
    ):
        if obj.status == "approved":

            self.publish_submission(obj)

            obj.reviewed_at = timezone.now()

        elif obj.status == "rejected":

            obj.reviewed_at = timezone.now()

        super().save_model(
            request,
            obj,
            form,
            change
        )


    @admin.action(
        description="Approve selected submissions"
    )
    def approve_submissions(
        self,
        request,
        queryset
    ):
        for submission in queryset:

            self.publish_submission(
                submission
            )

            submission.status = "approved"
            submission.reviewed_at = timezone.now()

            submission.save(
                update_fields=[
                    "status",
                    "reviewed_at",
                ]
            )


    @admin.action(
        description="Reject selected submissions"
    )
    def reject_submissions(
        self,
        request,
        queryset
    ):
        queryset.filter(
            status="pending"
        ).update(
            status="rejected",
            reviewed_at=timezone.now(),
        )
        
        
@admin.register(PhotoTag)
class PhotoTagAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
    )

    list_editable = (
        "is_active",
    )
    
    
@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "category",
        "published_date",
        "is_new",
        "is_published",
    )

    list_filter = (
        "category",
        "is_new",
        "is_published",
        "published_date",
    )

    search_fields = (
        "title",
        "description",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    list_editable = (
        "is_new",
        "is_published",
    )            