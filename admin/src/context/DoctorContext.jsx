import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const DoctorContext = createContext()

const DoctorContextProvider = (props) =>{
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [doctorToken, setDoctorToken] = useState(localStorage.getItem("doctorToken") ? localStorage.getItem("doctorToken") : "")
    const [appointments, setAppointments] = useState([])
    const [dashboardData, setDashboardData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/doctor/doctor-appointments', {headers:{doctorToken}})
            if (data.success){
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const completeAppointments = async (appointmentID) => {
        try {
            const { data } = await axios.post(backendURL + '/api/doctor/appointment-completed',{appointmentID}, {headers:{doctorToken}})
            if (data.success){
                toast.success(data.message)
                getAppointments()
                getDashboardData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentID) => {
        try {
            const { data } = await axios.post(backendURL + '/api/doctor/appointment-cancel',{appointmentID}, {headers:{doctorToken}})
            if (data.success){
                toast.success(data.message)
                getAppointments()
                getDashboardData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getDashboardData = async ()=>{
        try {
            const { data } = await axios.get(backendURL + '/api/doctor/dashboard', {headers:{doctorToken}})
            if (data.success){
                setDashboardData(data.dashboardData)
                console.log(data.dashboardData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
          console.log(error)
          toast.error(error.message)  
        }
    }

    const getProfileData = async() =>{
        try {
            const { data } = await axios.get(backendURL + '/api/doctor/doctor-profile', {headers:{doctorToken}})
            if (data.success){
                setProfileData(data.profileData)
                console.log(data.profileData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)  
        }
    }

    const value = {
        doctorToken, setDoctorToken, backendURL, appointments, 
        setAppointments, getAppointments, completeAppointments, cancelAppointment, 
        dashboardData, setDashboardData, getDashboardData, profileData, setProfileData,
        getProfileData
    }

    return (
        <DoctorContext.Provider value = {value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider