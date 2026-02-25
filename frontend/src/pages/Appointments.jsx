import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets_frontend/assets'
import { toast } from 'react-toastify'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'

const Appointments = () => {

  const {docID} = useParams();
  const navigate = useNavigate();
  const {doctors, currencySymbol, backendURL, userToken, getDoctors} = useContext(AppContext);
  const [docInfo,setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docID)
    setDocInfo(docInfo)
  }

  const getAvailableSlots = async () =>{
    setDocSlot([])

    // get current date
    let today = new Date()
    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      // setting end time based on date
      let endTime = new Date(currentDate)
      endTime.setHours(21,0,0,0)

      const isToday = i === 0

      // setting starting hours
      if (isToday) {
        let currentHour = currentDate.getHours()
        let currentMin = currentDate.getMinutes()
        
        if (currentHour < 10) {
          // Before 10 AM, start at 10:00
          currentDate.setHours(10, 0, 0, 0)
        } else if (currentHour >= 20 && currentMin > 30 || currentHour >= 21) {
        // After 9 PM, skip today (no slots available)
        continue
        } else {
          // After 10 AM, round up to next 30-min slot
          if (currentMin > 30) {
            currentDate.setHours(currentHour + 1, 0, 0, 0)
          } else if (currentMin > 0) {
            currentDate.setMinutes(30, 0, 0)
          }
        }
      } else {
        currentDate.setHours(10, 0, 0, 0)
      }
      
      let timeSlots = []

      while (currentDate < endTime){
        let formattedTime = currentDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const currentSlotDate = day + "_" + month + "_" + year
        const currentSlotTime = formattedTime

        const isSlotAvailable = docInfo.slotsBooked[currentSlotDate] && docInfo.slotsBooked[currentSlotDate].includes(currentSlotTime) ? false : true

        if (isSlotAvailable){
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlot(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async() => {
    if (!userToken){
      toast.warn("Please Login to Book Appointment")
      return navigate('/login')
    }

    try {
      const date = docSlot[slotIndex][0].dateTime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year

      const { data } = await axios.post(backendURL + "/api/user/book-appointment", {docID, slotDate, slotTime}, {headers: {userToken: userToken}})
      if (data.success){
        toast.success("Appointment Booked Successfully")
        getDoctors()
        navigate('/userAppointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=> {
    fetchDocInfo();
  },[doctors, docID])

  useEffect(()=> {
    getAvailableSlots();
  },[docInfo])

  useEffect(()=> {
    console.log(docSlot);
  },[docSlot])


  return docInfo && (
    <div>
      <div className = 'flex flex-col sm:flex-row gap-4'>
        <div>
          <img className = 'bg-primary w-full sm:max-w-72 rounded-lg' src= {docInfo.image} alt = ""/>
        </div>

        <div className = 'flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className = 'flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name} 
            <img className = 'w-5' src = {assets.verified_icon} alt = ""/>
          </p>
          <div className = 'flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.education} - {docInfo.speciality}</p>
            <button className = 'py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          <div>
            <p className = 'flex item-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src = {assets.info_icon} alt = ""/></p>
            <p className = 'text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className = 'text-gray-500 font-medium mt-4'>
            Appointment Fee: <span className = 'text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      <div className = 'sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className = 'flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlot.length && docSlot.map((item, index)=>(
              <div onClick = {()=> setSlotIndex(index)} className = {`text-center py-5 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray'}`} key = {index}>
                <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className = 'flex items-center grap-3 w-full overflow-x-scroll mt-4'>
          {docSlot.length && docSlot[slotIndex].map((item, index)=> (
            <p onClick = {()=> setSlotTime(item.time)} className = {`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ?'bg-primary text-white' : 'text-gray-400 border border-gray-300' }`} key = {index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button onClick = {bookAppointment} className = 'bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
      </div>
      <RelatedDoctors docID = {docID} speciality = {docInfo.speciality}/>
    </div>
  )
}

export default Appointments