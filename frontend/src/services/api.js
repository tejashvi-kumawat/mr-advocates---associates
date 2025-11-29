const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getAuthHeaders() {
    const token = localStorage.getItem('accessToken')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    }

    try {
      const response = await fetch(url, { ...options, headers })
      
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshToken()
        if (refreshed) {
          // Retry the original request
          const retryHeaders = {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
            ...options.headers,
          }
          const retryResponse = await fetch(url, { ...options, headers: retryHeaders })
          return await this.handleResponse(retryResponse)
        } else {
          // Refresh failed, logout
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/secret-admin-portal-2024/login'
          throw new Error('Session expired')
        }
      }

      return await this.handleResponse(response)
    } catch (error) {
      throw error
    }
  }

  async handleResponse(response) {
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')
    const data = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const error = new Error(data.message || data.detail || 'Request failed')
      error.response = { status: response.status, data }
      throw error
    }

    return { data, status: response.status }
  }

  async refreshToken() {
    const refresh = localStorage.getItem('refreshToken')
    if (!refresh) return false

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.access)
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  // Generic methods
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  async uploadFile(endpoint, formData) {
    const token = localStorage.getItem('accessToken')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    })

    return await this.handleResponse(response)
  }

  // ============================================
  // PUBLIC APIs
  // ============================================

  async getPracticeAreas() {
    return this.get('/practice-areas/')
  }

  async getPracticeArea(slug) {
    return this.get(`/practice-areas/${slug}/`)
  }

  async getTeamMembers() {
    return this.get('/team/')
  }

  async getTeamMember(slug) {
    return this.get(`/team/${slug}/`)
  }

  async getNews(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.get(`/news/${query ? '?' + query : ''}`)
  }

  async getNewsArticle(slug) {
    return this.get(`/news/${slug}/`)
  }

  async getServices() {
    return this.get('/services/')
  }

  async getCaseStudies(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.get(`/case-studies/${query ? '?' + query : ''}`)
  }

  async getCaseStudy(slug) {
    return this.get(`/case-studies/${slug}/`)
  }

  async getTestimonials() {
    return this.get('/testimonials/')
  }

  async getFAQs() {
    return this.get('/faqs/')
  }

  async createEnquiry(data) {
    return this.post('/enquiry/', data)
  }

  async createAppointment(data) {
    return this.post('/appointment/', data)
  }

  async subscribeNewsletter(data) {
    return this.post('/newsletter/subscribe/', data)
  }

  async applyCareer(formData) {
    return this.uploadFile('/careers/apply/', formData)
  }

  async getSEOMetadata(pageName) {
    return this.get(`/seo/${pageName}/`)
  }

  // ============================================
  // ADMIN APIs
  // ============================================

  // Dashboard
  async getDashboardStats() {
    return this.get('/admin/dashboard/stats/')
  }

  // News Articles
  async getAdminNews(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.get(`/admin/news/${query ? '?' + query : ''}`)
  }

  async getAdminNewsById(id) {
    return this.get(`/admin/news/${id}/`)
  }

  async createAdminNews(formData) {
    return this.uploadFile('/admin/news/', formData)
  }

  async updateAdminNews(id, formData) {
    const token = localStorage.getItem('accessToken')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    const response = await fetch(`${this.baseURL}/admin/news/${id}/`, {
      method: 'PUT',
      headers,
      body: formData
    })

    return await this.handleResponse(response)
  }

  async deleteAdminNews(id) {
    return this.delete(`/admin/news/${id}/`)
  }

  // Practice Areas
  async getAdminPracticeAreas() {
    return this.get('/admin/practice-areas/')
  }

  async getAdminPracticeAreaById(id) {
    return this.get(`/admin/practice-areas/${id}/`)
  }

  async createAdminPracticeArea(data) {
    return this.post('/admin/practice-areas/', data)
  }

  async updateAdminPracticeArea(id, data) {
    return this.put(`/admin/practice-areas/${id}/`, data)
  }

  async deleteAdminPracticeArea(id) {
    return this.delete(`/admin/practice-areas/${id}/`)
  }

  // Team Members
  async getAdminTeam() {
    return this.get('/admin/team/')
  }

  async getAdminTeamById(id) {
    return this.get(`/admin/team/${id}/`)
  }

  async createAdminTeam(formData) {
    return this.uploadFile('/admin/team/', formData)
  }

  async updateAdminTeam(id, formData) {
    const token = localStorage.getItem('accessToken')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    const response = await fetch(`${this.baseURL}/admin/team/${id}/`, {
      method: 'PUT',
      headers,
      body: formData
    })

    return await this.handleResponse(response)
  }

  async deleteAdminTeam(id) {
    return this.delete(`/admin/team/${id}/`)
  }

  // Services
  async getAdminServices() {
    return this.get('/admin/services/')
  }

  async getAdminServiceById(id) {
    return this.get(`/admin/services/${id}/`)
  }

  async createAdminService(data) {
    return this.post('/admin/services/', data)
  }

  async updateAdminService(id, data) {
    return this.put(`/admin/services/${id}/`, data)
  }

  async deleteAdminService(id) {
    return this.delete(`/admin/services/${id}/`)
  }

  // Case Studies
  async getAdminCaseStudies(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.get(`/admin/case-studies/${query ? '?' + query : ''}`)
  }

  async getAdminCaseStudyById(id) {
    return this.get(`/admin/case-studies/${id}/`)
  }

  async createAdminCaseStudy(formData) {
    return this.uploadFile('/admin/case-studies/', formData)
  }

  async updateAdminCaseStudy(id, formData) {
    const token = localStorage.getItem('accessToken')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    const response = await fetch(`${this.baseURL}/admin/case-studies/${id}/`, {
      method: 'PUT',
      headers,
      body: formData
    })

    return await this.handleResponse(response)
  }

  async deleteAdminCaseStudy(id) {
    return this.delete(`/admin/case-studies/${id}/`)
  }

  // Testimonials
  async getAdminTestimonials() {
    return this.get('/admin/testimonials/')
  }

  async getAdminTestimonialById(id) {
    return this.get(`/admin/testimonials/${id}/`)
  }

  async createAdminTestimonial(formData) {
    return this.uploadFile('/admin/testimonials/', formData)
  }

  async updateAdminTestimonial(id, formData) {
    const token = localStorage.getItem('accessToken')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

    const response = await fetch(`${this.baseURL}/admin/testimonials/${id}/`, {
      method: 'PUT',
      headers,
      body: formData
    })

    return await this.handleResponse(response)
  }

  async deleteAdminTestimonial(id) {
    return this.delete(`/admin/testimonials/${id}/`)
  }

  // FAQs
  async getAdminFAQs() {
    return this.get('/admin/faqs/')
  }

  async getAdminFAQById(id) {
    return this.get(`/admin/faqs/${id}/`)
  }

  async createAdminFAQ(data) {
    return this.post('/admin/faqs/', data)
  }

  async updateAdminFAQ(id, data) {
    return this.put(`/admin/faqs/${id}/`, data)
  }

  async deleteAdminFAQ(id) {
    return this.delete(`/admin/faqs/${id}/`)
  }

  // Enquiries
  async getAdminEnquiries(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.get(`/admin/enquiries/${query ? '?' + query : ''}`)
  }

  async updateEnquiryStatus(id, status, notes) {
    return this.patch(`/admin/enquiries/${id}/update_status/`, { status, notes })
  }

  // Appointments
  async getAdminAppointments(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.get(`/admin/appointments/${query ? '?' + query : ''}`)
  }

  async updateAppointmentStatus(id, status, notes) {
    return this.patch(`/admin/appointments/${id}/update_status/`, { status, notes })
  }

  // Newsletter Subscribers
  async getAdminSubscribers(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.get(`/admin/subscribers/${query ? '?' + query : ''}`)
  }

  async deleteAdminSubscriber(id) {
    return this.delete(`/admin/subscribers/${id}/`)
  }

  // Career Applications
  async getAdminCareers(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.get(`/admin/careers/${query ? '?' + query : ''}`)
  }

  // SEO Metadata
  async getAdminSEO() {
    return this.get('/admin/seo/')
  }

  async getAdminSEOById(id) {
    return this.get(`/admin/seo/${id}/`)
  }

  async createAdminSEO(formData) {
    return this.uploadFile('/admin/seo/', formData)
  }

  async updateAdminSEO(id, formData) {
    const token = localStorage.getItem('accessToken')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    // Don't set Content-Type for FormData, browser will set it with boundary

    const response = await fetch(`${this.baseURL}/admin/seo/${id}/`, {
      method: 'PATCH',
      headers,
      body: formData
    })

    return await this.handleResponse(response)
  }

  async deleteAdminSEO(id) {
    return this.delete(`/admin/seo/${id}/`)
  }

  // Activity Logs
  async getAdminActivityLogs(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.get(`/admin/activity-logs/${query ? '?' + query : ''}`)
  }
}

export default new ApiService()
