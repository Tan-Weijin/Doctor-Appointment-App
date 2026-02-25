import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets_admin/assets'

const DoctorDashboard = () => {

  const {doctorToken, dashboardData, getDashboardData, cancelAppointment, completeAppointments} = useContext(DoctorContext)
  const { currency, slotDateFormat }=  useContext(AppContext)

  useEffect(()=>{
    if(doctorToken){
      getDashboardData()
    }
  },[doctorToken])

  return dashboardData && (
    <div className = 'm-5'>
      <div className = 'flex flex-wrap gap-3'>
        <div className = 'flex items-center gap-2 bg-white p-4 min-w-52 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className = 'w-14' src = {assets.earning_icon} />
          <div>
            <p className = 'text-xl font-semibold text-gray-600'>{currency} {dashboardData.earnings}</p>
            <p className = 'text-gray-400'>Earnings</p>
          </div>
        </div>
        <div className = 'flex items-center gap-2 bg-white p-4 min-w-52 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className = 'w-14' src = {assets.appointments_icon} />
          <div>
            <p className = 'text-xl font-semibold text-gray-600'>{dashboardData.appointments}</p>
            <p className = 'text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className = 'flex items-center gap-2 bg-white p-4 min-w-52 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className = 'w-14' src = {assets.patients_icon} />
          <div>
            <p className = 'text-xl font-semibold text-gray-600'>{dashboardData.patients}</p>
            <p className = 'text-gray-400'>Patients</p>
          </div>
        </div>
      </div>
      <div className = 'bg-white'>
        <div className = 'flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src = {assets.list_icon}/>
          <p className = 'font-semibold'>Latest Bookings</p>
        </div>
        <div className = 'pt-4 border border-t-0'>
          {
            dashboardData.latestAppointments.map((item,index)=>(
              <div className = 'flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key = {index}>
                <img className = 'rounded-full w-10' src = {item.userData.image}/>
                <div className = 'flex-1 text-sm'>
                  <p className = 'text-gray-800 font-medium'>{item.userData.name}</p>
                  <p className = 'text-gray-600'>Booking on {slotDateFormat(item.slotDate)}</p>
                </div>
                {
                  item.cancelled 
                  ? <p className = 'text-red-500 font-medium'>Cancelled</p>
                  : item.isCompleted 
                  ? <p className = 'text-green-500 font-medium'>Completed</p>
                  :<div className = 'flex'>
                    <img onClick = {()=>cancelAppointment(item._id)} className = "w-10 cursor-pointer" src = {assets.cancel_icon}/>
                    <img onClick = {()=>completeAppointments(item._id)} className = "w-10 cursor-pointer" src = {assets.tick_icon}/>
                  </div>
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard