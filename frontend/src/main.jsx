import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles/variables.css'
import './styles/global.css'
import './styles/navbar.css'
import './styles/footer.css'
import './styles/hero.css'
import './styles/card.css'
import './styles/forms.css'
import './styles/animations.css'
import './styles/team.css'
import './styles/admin.css'
import './styles/star-rating.css'
import './styles/faq.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
