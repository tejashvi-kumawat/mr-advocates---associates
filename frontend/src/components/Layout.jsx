import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import AdminNavbar from './AdminNavbar'
import Footer from './Footer'

function Layout({ isAdmin = false }) {
  return (
    <>
      {isAdmin ? <AdminNavbar /> : <Navbar />}
      <main>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
    </>
  )
}

export default Layout
