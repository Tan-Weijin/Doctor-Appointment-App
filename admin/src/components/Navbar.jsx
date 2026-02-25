import React, { useContext } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {

    const {adminToken, setAdminToken} = useContext(AdminContext)
    const {doctorToken, setDoctorToken} = useContext(DoctorContext)


    const navigate = useNavigate();

    const logoutHandler = () =>{
        navigate('/')
        if (adminToken){
            adminToken && setAdminToken("")
            adminToken && localStorage.removeItem("adminToken")
        } else {
            doctorToken && setDoctorToken("")
            doctorToken && localStorage.removeItem("doctorToken")
        }
    }

  return (
    <div className = 'flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
        <div className = 'flex items-center gap-2 text-xs'>
            <img className = 'w-36 sm:w-40 cursor-pointer' src = {assets.admin_logo} alt=""/>
            <p className = 'border px-2.5 rp-.05 rounded-full border-gray-500 text-gray-600'>{adminToken ? 'Admin' : 'Doctor'}</p>
        </div>
        <button onClick = {logoutHandler} className = 'bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default Navbar