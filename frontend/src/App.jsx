import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Navbar from './components/Navbar'

import About from './pages/About'
import Appointments from './pages/Appointments'
import Contact from './pages/Contact'
import Doctors from './pages/Doctors'
import Home from './pages/Home'
import Login from './pages/Login'
import UserAppointments from './pages/UserAppointments'
import UserProfile from './pages/UserProfile'

import Footer from './components/Footer'


const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
    <ToastContainer/>
    <Navbar/>

    <Routes>
      <Route path = '/about' element={<About/>}/>
      <Route path = '/appointments/:docID' element={<Appointments/>}/>
      <Route path = '/contact' element={<Contact/>}/>
      <Route path = '/doctors' element={<Doctors/>}/>
      <Route path = '/doctors/:speciality' element={<Doctors/>}/>
      <Route path = '/' element={<Home/>}/>
      <Route path = '/login' element={<Login/>}/>
      <Route path = '/userAppointments' element={<UserAppointments/>}/>
      <Route path = '/userProfile' element={<UserProfile/>}/>
    </Routes>
    
    <Footer/>
    </div>
  )
}

export default App