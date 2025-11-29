from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q
from django.utils import timezone
from .models import *
from .serializers import *
from .utils import log_activity


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# ============================================
# PUBLIC APIs (No Authentication Required)
# ============================================

class PracticeAreaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PracticeArea.objects.filter(is_active=True)
    serializer_class = PracticeAreaSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class NewsArticlePublicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NewsArticle.objects.filter(is_published=True)
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return NewsArticleDetailSerializer
        return NewsArticleListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(summary__icontains=search)
            )
        
        return queryset


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class CaseStudyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CaseStudy.objects.filter(is_published=True)
    serializer_class = CaseStudySerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination
    lookup_field = 'slug'


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(is_published=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_published=True)
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
@permission_classes([AllowAny])
def create_enquiry(request):
    serializer = EnquirySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Your enquiry has been submitted successfully. We will contact you soon.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'message': 'Please check the form and try again.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_appointment(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Your appointment request has been submitted. We will confirm shortly.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'message': 'Please check the form and try again.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe_newsletter(request):
    serializer = NewsletterSubscriberSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Thank you for subscribing to our newsletter!'
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'message': 'Subscription failed. You may already be subscribed.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def apply_career(request):
    serializer = CareerApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Your application has been submitted successfully.'
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_seo_metadata(request, page_name):
    try:
        seo = SEOMetadata.objects.get(page_name=page_name)
        serializer = SEOMetadataSerializer(seo, context={'request': request})
        return Response(serializer.data)
    except SEOMetadata.DoesNotExist:
        return Response({'message': 'SEO metadata not found'}, status=status.HTTP_404_NOT_FOUND)


# ============================================
# ADMIN APIs (Authentication Required)
# ============================================

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def dashboard_stats(request):
    stats = {
        'total_enquiries': Enquiry.objects.count(),
        'new_enquiries': Enquiry.objects.filter(status='new').count(),
        'total_appointments': Appointment.objects.count(),
        'pending_appointments': Appointment.objects.filter(status='pending').count(),
        'total_subscribers': NewsletterSubscriber.objects.filter(is_active=True).count(),
        'total_news': NewsArticle.objects.count(),
        'total_testimonials': Testimonial.objects.count(),
        'total_case_studies': CaseStudy.objects.count(),
        'recent_enquiries': Enquiry.objects.all()[:5],
        'recent_appointments': Appointment.objects.all()[:5],
    }
    
    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)


class AdminPracticeAreaViewSet(viewsets.ModelViewSet):
    queryset = PracticeArea.objects.all()
    serializer_class = PracticeAreaSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def perform_create(self, serializer):
        instance = serializer.save()
        log_activity(self.request.user, 'Created', 'PracticeArea', instance.id)
    
    def perform_update(self, serializer):
        instance = serializer.save()
        log_activity(self.request.user, 'Updated', 'PracticeArea', instance.id)
    
    def perform_destroy(self, instance):
        log_activity(self.request.user, 'Deleted', 'PracticeArea', instance.id)
        instance.delete()


class AdminTeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def perform_create(self, serializer):
        instance = serializer.save()
        log_activity(self.request.user, 'Created', 'TeamMember', instance.id)
    
    def perform_update(self, serializer):
        instance = serializer.save()
        log_activity(self.request.user, 'Updated', 'TeamMember', instance.id)
    
    def perform_destroy(self, instance):
        log_activity(self.request.user, 'Deleted', 'TeamMember', instance.id)
        instance.delete()


class AdminNewsArticleViewSet(viewsets.ModelViewSet):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleDetailSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = StandardResultsSetPagination
    
    def perform_create(self, serializer):
        instance = serializer.save(author=self.request.user)
        log_activity(self.request.user, 'Created', 'NewsArticle', instance.id)
    
    def perform_update(self, serializer):
        instance = serializer.save()
        log_activity(self.request.user, 'Updated', 'NewsArticle', instance.id)
    
    def perform_destroy(self, instance):
        log_activity(self.request.user, 'Deleted', 'NewsArticle', instance.id)
        instance.delete()


class AdminServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminCaseStudyViewSet(viewsets.ModelViewSet):
    queryset = CaseStudy.objects.all()
    serializer_class = CaseStudySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = StandardResultsSetPagination
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class AdminTestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class AdminFAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminEnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = StandardResultsSetPagination
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        enquiry = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        
        if new_status:
            enquiry.status = new_status
            if notes:
                enquiry.notes = notes
            enquiry.save()
            log_activity(request.user, f'Updated enquiry status to {new_status}', 'Enquiry', enquiry.id)
            return Response({'message': 'Status updated successfully'})
        
        return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)


class AdminAppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = StandardResultsSetPagination
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        appointment = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        
        if new_status:
            appointment.status = new_status
            if notes:
                appointment.notes = notes
            appointment.save()
            log_activity(request.user, f'Updated appointment status to {new_status}', 'Appointment', appointment.id)
            return Response({'message': 'Status updated successfully'})
        
        return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)


class AdminNewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = StandardResultsSetPagination


class AdminCareerApplicationViewSet(viewsets.ModelViewSet):
    queryset = CareerApplication.objects.all()
    serializer_class = CareerApplicationSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = StandardResultsSetPagination


class AdminSEOMetadataViewSet(viewsets.ModelViewSet):
    queryset = SEOMetadata.objects.all()
    serializer_class = SEOMetadataSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class AdminActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = StandardResultsSetPagination
