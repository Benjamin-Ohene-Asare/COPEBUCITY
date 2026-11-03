from django.db import models


class SiteSetting(models.Model):
    church_name = models.CharField(
        max_length=150,
        default="The Church of Pentecost"
    )

    phone = models.CharField(
        max_length=30,
        blank=True
    )

    location = models.CharField(
        max_length=255,
        blank=True
    )

    logo = models.ImageField(
        upload_to="site/",
        blank=True,
        null=True
    )

    facebook_url = models.URLField(
        blank=True
    )

    youtube_url = models.URLField(
        blank=True
    )

    instagram_url = models.URLField(
        blank=True
    )

    tiktok_url = models.URLField(
        blank=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.church_name


class HeroSlide(models.Model):
    small_title = models.CharField(
        max_length=200
    )

    title = models.CharField(
        max_length=255
    )

    image = models.ImageField(
        upload_to="hero/"
    )

    button_text = models.CharField(
        max_length=100,
        blank=True
    )

    button_url = models.CharField(
        max_length=255,
        blank=True
    )

    order = models.PositiveIntegerField(
        default=0
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title
    

class AboutSection(models.Model):
    title = models.CharField(
        max_length=200,
        default="About Ebukrom District"
    )

    subtitle = models.CharField(
        max_length=255,
        blank=True
    )

    description = models.TextField()

    history = models.TextField(
        blank=True
    )

    vision = models.TextField(
        blank=True
    )

    mission = models.TextField(
        blank=True
    )

    image = models.ImageField(
        upload_to="about/",
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        default=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title   
    
    
    

class Ministry(models.Model):
    name = models.CharField(
        max_length=150
    )

    slug = models.SlugField(
        unique=True
    )

    short_description = models.TextField(
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    image = models.ImageField(
        upload_to="ministries/",
        blank=True,
        null=True
    )

    display_order = models.PositiveIntegerField(
        default=0
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name    
    

 
class Leader(models.Model):
    LEADER_TYPES = [
        ("district", "District Leadership"),
        ("ministry", "Ministry Leader"),
        ("past", "Past Pastor"),
    ]

    leader_type = models.CharField(
        max_length=20,
        choices=LEADER_TYPES
    )

    name = models.CharField(
        max_length=150
    )

    title = models.CharField(
        max_length=150
    )

    image = models.ImageField(
        upload_to="leaders/",
        blank=True,
        null=True
    )

    spouse_name = models.CharField(
        max_length=150,
        blank=True
    )

    spouse_image = models.ImageField(
        upload_to="leaders/spouses/",
        blank=True,
        null=True
    )

    ministry = models.ForeignKey(
        Ministry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="leaders"
    )

    start_year = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    end_year = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    biography = models.TextField(
        blank=True
    )

    display_order = models.PositiveIntegerField(
        default=0
    )

    is_current = models.BooleanField(
        default=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self):
        return f"{self.name} - {self.title}"    
    
    


class SermonSeries(models.Model):
    name = models.CharField(
        max_length=150,
        unique=True
    )

    slug = models.SlugField(
        unique=True
    )

    description = models.TextField(
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name    
    
    

class Sermon(models.Model):
    title = models.CharField(
        max_length=255
    )

    slug = models.SlugField(
        unique=True
    )

    preacher = models.CharField(
        max_length=180
    )

    preacher_title = models.CharField(
        max_length=120,
        blank=True
    )

    series = models.ForeignKey(
        SermonSeries,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sermons"
    )

    scripture = models.CharField(
        max_length=255,
        blank=True
    )

    topic = models.CharField(
        max_length=255,
        blank=True
    )

    thumbnail = models.ImageField(
        upload_to="sermons/thumbnails/"
    )

    audio_file = models.FileField(
        upload_to="sermons/audio/",
        blank=True,
        null=True
    )

    short_description = models.TextField(
        blank=True
    )

    exposition = models.TextField(
        blank=True
    )

    sermon_date = models.DateField()

    duration = models.CharField(
        max_length=30,
        blank=True
    )

    is_featured = models.BooleanField(
        default=False
    )

    is_published = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-sermon_date", "-created_at"]

    def __str__(self):
        return self.title    
    
    
    
    
class SermonInsight(models.Model):
    sermon = models.ForeignKey(
        Sermon,
        on_delete=models.CASCADE,
        related_name="insights"
    )

    text = models.TextField()

    order = models.PositiveIntegerField(
        default=0
    )

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.sermon.title} - Insight {self.order}" 
    
    
    
    
class MediaStream(models.Model):
    STREAM_TYPES = [
        ("live", "Live"),
        ("video", "Video"),
    ]

    PLATFORMS = [
        ("youtube", "YouTube"),
        ("facebook", "Facebook"),
    ]

    title = models.CharField(
        max_length=255
    )

    slug = models.SlugField(
        unique=True
    )

    description = models.TextField(
        blank=True
    )

    thumbnail = models.ImageField(
        upload_to="streams/thumbnails/",
        blank=True,
        null=True
    )

    platform = models.CharField(
        max_length=20,
        choices=PLATFORMS
    )

    stream_type = models.CharField(
        max_length=20,
        choices=STREAM_TYPES,
        default="video"
    )

    video_url = models.URLField()

    embed_url = models.URLField(
        blank=True
    )

    channel_name = models.CharField(
        max_length=150,
        default="Ebucity Church"
    )

    published_at = models.DateTimeField(
        blank=True,
        null=True
    )

    is_live = models.BooleanField(
        default=False
    )

    is_featured = models.BooleanField(
        default=False
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title 
    
    

class DocumentCategory(models.Model):
    name = models.CharField(
        max_length=150,
        unique=True
    )

    slug = models.SlugField(
        unique=True
    )

    description = models.TextField(
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name 
    
    
    
    
class Document(models.Model):
    title = models.CharField(
        max_length=255
    )

    slug = models.SlugField(
        unique=True
    )

    category = models.ForeignKey(
        DocumentCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="documents"
    )

    description = models.TextField(
        blank=True
    )

    file = models.FileField(
        upload_to="documents/files/"
    )

    cover_image = models.ImageField(
        upload_to="documents/covers/",
        blank=True,
        null=True
    )

    published_date = models.DateField(
        blank=True,
        null=True
    )

    is_featured = models.BooleanField(
        default=False
    )

    is_published = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-published_date", "-created_at"]

    def __str__(self):
        return self.title    
    
    
    
class Event(models.Model):
    title = models.CharField(
        max_length=255
    )

    slug = models.SlugField(
        unique=True
    )

    short_description = models.TextField(
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    image = models.ImageField(
        upload_to="events/"
    )

    start_date = models.DateField()

    end_date = models.DateField(
        blank=True,
        null=True
    )

    start_time = models.TimeField(
        blank=True,
        null=True
    )

    end_time = models.TimeField(
        blank=True,
        null=True
    )

    venue = models.CharField(
        max_length=255
    )

    organizer = models.CharField(
        max_length=150,
        blank=True
    )

    is_featured = models.BooleanField(
        default=False
    )

    is_published = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["start_date", "start_time"]

    def __str__(self):
        return self.title 
    
    
    

class GalleryAlbum(models.Model):
    title = models.CharField(
        max_length=255
    )

    slug = models.SlugField(
        unique=True
    )

    description = models.TextField(
        blank=True
    )

    cover_image = models.ImageField(
        upload_to="gallery/covers/",
        blank=True,
        null=True
    )

    event_date = models.DateField(
        blank=True,
        null=True
    )

    allow_public_upload = models.BooleanField(
        default=False
    )

    is_published = models.BooleanField(
        default=True
    )

    display_order = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = [
            "display_order",
            "-event_date",
            "-created_at"
        ]

    def __str__(self):
        return self.title       
             
             
class GalleryImage(models.Model):
    album = models.ForeignKey(
        GalleryAlbum,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="gallery/images/"
    )

    caption = models.CharField(
        max_length=255,
        blank=True
    )

    uploaded_by = models.CharField(
        max_length=150,
        blank=True
    )

    display_order = models.PositiveIntegerField(
        default=0
    )

    is_published = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = [
            "display_order",
            "-created_at"
        ]

    def __str__(self):
        return f"{self.album.title} - Image {self.id}"           


class GallerySubmission(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    album = models.ForeignKey(
        GalleryAlbum,
        on_delete=models.CASCADE,
        related_name="submissions"
    )

    name = models.CharField(
        max_length=150,
        blank=True
    )

    caption = models.CharField(
        max_length=255,
        blank=True
    )

    image = models.ImageField(
        upload_to="gallery/submissions/"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    reviewed_at = models.DateTimeField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.album.title} - {self.status}" 
    
    

class PhotoTag(models.Model):
    name = models.CharField(
        max_length=200
    )

    png_file = models.ImageField(
        upload_to="photo_tags/"
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name   
    
    
    
class Announcement(models.Model):
    title = models.CharField(
        max_length=255
    )

    slug = models.SlugField(
        max_length=255,
        unique=True
    )

    category = models.CharField(
        max_length=100,
        default="ANNOUNCEMENT"
    )

    description = models.TextField()

    image = models.ImageField(
        upload_to="announcements/",
        blank=True,
        null=True
    )

    published_date = models.DateField()

    is_new = models.BooleanField(
        default=False
    )

    is_published = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = [
            "-published_date",
            "-created_at",
        ]

    def __str__(self):
        return self.title          