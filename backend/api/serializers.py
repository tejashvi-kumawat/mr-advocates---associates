from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class PracticeAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PracticeArea
        fields = '__all__'


class TeamMemberSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TeamMember
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None


class NewsArticleListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = NewsArticle
        fields = ['id', 'title', 'slug', 'category', 'summary', 'image_url', 
                  'author_name', 'published_date', 'views', 'is_published']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None


class NewsArticleDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = NewsArticle
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class CaseStudySerializer(serializers.ModelSerializer):
    practice_area_name = serializers.CharField(source='practice_area.title', read_only=True, required=False, allow_blank=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CaseStudy
        fields = '__all__'
        extra_kwargs = {
            'practice_area': {'required': False, 'allow_null': True},
            'slug': {'required': False, 'read_only': True},
        }
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None
    
    def create(self, validated_data):
        # Handle empty practice_area
        practice_area = validated_data.pop('practice_area', None)
        if practice_area == '' or practice_area is None:
            validated_data['practice_area'] = None
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Handle empty practice_area
        practice_area = validated_data.get('practice_area', None)
        if practice_area == '':
            validated_data['practice_area'] = None
        return super().update(instance, validated_data)


class TestimonialSerializer(serializers.ModelSerializer):
    practice_area_name = serializers.CharField(source='practice_area.title', read_only=True, required=False, allow_blank=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Testimonial
        fields = '__all__'
        extra_kwargs = {
            'practice_area': {'required': False, 'allow_null': True},
            'client_designation': {'required': False, 'allow_blank': True},
            'client_image': {'required': False, 'allow_null': True},
        }
    
    def get_image_url(self, obj):
        if obj.client_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.client_image.url)
        return None
    
    def create(self, validated_data):
        # Handle empty practice_area
        practice_area = validated_data.pop('practice_area', None)
        if practice_area == '' or practice_area is None:
            validated_data['practice_area'] = None
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Handle empty practice_area
        practice_area = validated_data.get('practice_area', None)
        if practice_area == '':
            validated_data['practice_area'] = None
        return super().update(instance, validated_data)


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'


class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'


class CareerApplicationSerializer(serializers.ModelSerializer):
    resume_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CareerApplication
        fields = '__all__'
    
    def get_resume_url(self, obj):
        if obj.resume:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume.url)
        return None


class SEOMetadataSerializer(serializers.ModelSerializer):
    og_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = SEOMetadata
        fields = '__all__'
    
    def get_og_image_url(self, obj):
        if obj.og_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.og_image.url)
        return None


class ActivityLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = '__all__'


class DashboardStatsSerializer(serializers.Serializer):
    total_enquiries = serializers.IntegerField()
    new_enquiries = serializers.IntegerField()
    total_appointments = serializers.IntegerField()
    pending_appointments = serializers.IntegerField()
    total_subscribers = serializers.IntegerField()
    total_news = serializers.IntegerField()
    total_testimonials = serializers.IntegerField()
    total_case_studies = serializers.IntegerField()
    recent_enquiries = EnquirySerializer(many=True)
    recent_appointments = AppointmentSerializer(many=True)
