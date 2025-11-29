from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

# Public router
public_router = DefaultRouter()
public_router.register(r'practice-areas', views.PracticeAreaViewSet, basename='practice-area')
public_router.register(r'team', views.TeamMemberViewSet, basename='team')
public_router.register(r'news', views.NewsArticlePublicViewSet, basename='news')
public_router.register(r'services', views.ServiceViewSet, basename='service')
public_router.register(r'case-studies', views.CaseStudyViewSet, basename='case-study')
public_router.register(r'testimonials', views.TestimonialViewSet, basename='testimonial')
public_router.register(r'faqs', views.FAQViewSet, basename='faq')

# Admin router
admin_router = DefaultRouter()
admin_router.register(r'practice-areas', views.AdminPracticeAreaViewSet, basename='admin-practice-area')
admin_router.register(r'team', views.AdminTeamMemberViewSet, basename='admin-team')
admin_router.register(r'news', views.AdminNewsArticleViewSet, basename='admin-news')
admin_router.register(r'services', views.AdminServiceViewSet, basename='admin-service')
admin_router.register(r'case-studies', views.AdminCaseStudyViewSet, basename='admin-case-study')
admin_router.register(r'testimonials', views.AdminTestimonialViewSet, basename='admin-testimonial')
admin_router.register(r'faqs', views.AdminFAQViewSet, basename='admin-faq')
admin_router.register(r'enquiries', views.AdminEnquiryViewSet, basename='admin-enquiry')
admin_router.register(r'appointments', views.AdminAppointmentViewSet, basename='admin-appointment')
admin_router.register(r'subscribers', views.AdminNewsletterSubscriberViewSet, basename='admin-subscriber')
admin_router.register(r'careers', views.AdminCareerApplicationViewSet, basename='admin-career')
admin_router.register(r'seo', views.AdminSEOMetadataViewSet, basename='admin-seo')
admin_router.register(r'activity-logs', views.AdminActivityLogViewSet, basename='admin-activity-log')

urlpatterns = [
    # Authentication
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Public APIs
    path('', include(public_router.urls)),
    path('enquiry/', views.create_enquiry, name='create-enquiry'),
    path('appointment/', views.create_appointment, name='create-appointment'),
    path('newsletter/subscribe/', views.subscribe_newsletter, name='subscribe-newsletter'),
    path('careers/apply/', views.apply_career, name='apply-career'),
    path('seo/<str:page_name>/', views.get_seo_metadata, name='get-seo'),
    
    # Admin APIs
    path('admin/', include(admin_router.urls)),
    path('admin/dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]

