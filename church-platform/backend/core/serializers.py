from rest_framework import serializers
from .models import MediaStream

from rest_framework import serializers

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


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = "__all__"


class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = "__all__"
        
        
        
        
class AboutSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutSection
        fields = "__all__"


class MinistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Ministry
        fields = "__all__"


class LeaderSerializer(serializers.ModelSerializer):
    ministry_name = serializers.CharField(
        source="ministry.name",
        read_only=True
    )

    class Meta:
        model = Leader
        fields = "__all__"        
        
        
        
class SermonSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SermonSeries
        fields = "__all__"


class SermonInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = SermonInsight
        fields = [
            "id",
            "text",
            "order",
        ]


class SermonSerializer(serializers.ModelSerializer):
    series_name = serializers.CharField(
        source="series.name",
        read_only=True
    )

    insights = SermonInsightSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Sermon
        fields = "__all__"  
        
        
        


class MediaStreamSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaStream
        fields = "__all__"  
        
        
        
class DocumentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentCategory
        fields = "__all__"


class DocumentSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    class Meta:
        model = Document
        fields = "__all__"  
        
        
        
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"    
        
        

class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = "__all__"


class GalleryAlbumSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(
        many=True,
        read_only=True
    )

    image_count = serializers.SerializerMethodField()

    class Meta:
        model = GalleryAlbum
        fields = "__all__"

    def get_image_count(self, obj):
        return obj.images.filter(
            is_published=True
        ).count()


class GallerySubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GallerySubmission
        fields = [
            "id",
            "album",
            "name",
            "caption",
            "image",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "status",
            "created_at",
        ] 
        
        

class PhotoTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoTag
        fields = "__all__"
        
        
        

class AnnouncementSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = Announcement
        fields = "__all__"                                          