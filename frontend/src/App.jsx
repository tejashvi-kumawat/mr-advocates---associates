import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import Home from './routes/Home'
import About from './routes/About'
import PracticeAreas from './routes/PracticeAreas'
import PracticeAreaDetail from './routes/PracticeAreaDetail'
import Services from './routes/Services'
import Team from './routes/Team'
import TeamMemberDetail from './routes/TeamMemberDetail'
import LegalNews from './routes/LegalNews'
import NewsDetail from './routes/NewsDetail'
import CaseStudies from './routes/CaseStudies'
import CaseStudyDetail from './routes/CaseStudyDetail'
import Testimonials from './routes/Testimonials'
import FAQ from './routes/FAQ'
import Contact from './routes/Contact'
import Enquiry from './routes/Enquiry'
import Appointment from './routes/Appointment'
import Careers from './routes/Careers'

// Admin Pages
import AdminLogin from './routes/admin/AdminLogin'
import AdminDashboard from './routes/admin/AdminDashboard'
import AdminNews from './routes/admin/AdminNews'
import AdminNewsForm from './routes/admin/AdminNewsForm'
import AdminPracticeAreas from './routes/admin/AdminPracticeAreas'
import AdminPracticeAreasForm from './routes/admin/AdminPracticeAreasForm'
import AdminTeam from './routes/admin/AdminTeam'
import AdminTeamForm from './routes/admin/AdminTeamForm'
import AdminServices from './routes/admin/AdminServices'
import AdminServicesForm from './routes/admin/AdminServicesForm'
import AdminCaseStudies from './routes/admin/AdminCaseStudies'
import AdminCaseStudiesForm from './routes/admin/AdminCaseStudiesForm'
import AdminTestimonials from './routes/admin/AdminTestimonials'
import AdminTestimonialsForm from './routes/admin/AdminTestimonialsForm'
import AdminFAQ from './routes/admin/AdminFAQ'
import AdminFAQForm from './routes/admin/AdminFAQForm'
import AdminEnquiries from './routes/admin/AdminEnquiries'
import AdminAppointments from './routes/admin/AdminAppointments'
import AdminSubscribers from './routes/admin/AdminSubscribers'
import AdminCareers from './routes/admin/AdminCareers'
import AdminSEO from './routes/admin/AdminSEO'
import AdminSEOForm from './routes/admin/AdminSEOForm'
import AdminActivityLogs from './routes/admin/AdminActivityLogs'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="practice-areas" element={<PracticeAreas />} />
          <Route path="practice-areas/:slug" element={<PracticeAreaDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="team" element={<Team />} />
          <Route path="team/:slug" element={<TeamMemberDetail />} />
          <Route path="legal-news" element={<LegalNews />} />
          <Route path="legal-news/:slug" element={<NewsDetail />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="enquiry" element={<Enquiry />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="careers" element={<Careers />} />
        </Route>

        {/* Admin Login Route (No Layout) */}
        <Route path="/secret-admin-portal-2024/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/secret-admin-portal-2024" element={<ProtectedRoute><Layout isAdmin /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          
          <Route path="news" element={<AdminNews />} />
          <Route path="news/create" element={<AdminNewsForm />} />
          <Route path="news/edit/:id" element={<AdminNewsForm />} />
          
          <Route path="practice-areas" element={<AdminPracticeAreas />} />
          <Route path="practice-areas/create" element={<AdminPracticeAreasForm />} />
          <Route path="practice-areas/edit/:id" element={<AdminPracticeAreasForm />} />
          
          <Route path="team" element={<AdminTeam />} />
          <Route path="team/create" element={<AdminTeamForm />} />
          <Route path="team/edit/:id" element={<AdminTeamForm />} />
          
          <Route path="services" element={<AdminServices />} />
          <Route path="services/create" element={<AdminServicesForm />} />
          <Route path="services/edit/:id" element={<AdminServicesForm />} />
          
          <Route path="case-studies" element={<AdminCaseStudies />} />
          <Route path="case-studies/create" element={<AdminCaseStudiesForm />} />
          <Route path="case-studies/edit/:id" element={<AdminCaseStudiesForm />} />
          
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="testimonials/create" element={<AdminTestimonialsForm />} />
          <Route path="testimonials/edit/:id" element={<AdminTestimonialsForm />} />
          
          <Route path="faq" element={<AdminFAQ />} />
          <Route path="faq/create" element={<AdminFAQForm />} />
          <Route path="faq/edit/:id" element={<AdminFAQForm />} />
          
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route path="careers" element={<AdminCareers />} />
          <Route path="seo" element={<AdminSEO />} />
          <Route path="seo/create" element={<AdminSEOForm />} />
          <Route path="seo/edit/:id" element={<AdminSEOForm />} />
          <Route path="activity-logs" element={<AdminActivityLogs />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
