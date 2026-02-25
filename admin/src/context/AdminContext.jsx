import { createContext, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

export const AdminContext = createContext()

const AdminContextProvider = (props) =>{
    const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") ? localStorage.getItem("adminToken") : "")
    const [doctors,setDoctors] = useState([])
    const [appointments,setAppointments] = useState([])
    const [dashboardData, setDashboardData] = useState(false)
    const backendURL = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async() =>{
        try {
            const { data } = await axios.get(backendURL + '/api/admin/all-doctors', {headers: { adminToken: adminToken }})
            if (data.success) {
                setDoctors(data.doctors)
                console.log(doctors)
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
      const { data } = await axios.post(backendURL + "/api/admin/cancel-appointment", {appointmentID}, {headers: {adminToken}})
      if (data.success) {
        toast.success(data.message)
        getAllAppointments()
        getDashboardData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

    const changeAvailability = async (docID) => {
        try {
            const { data } = await axios.put(backendURL + '/api/admin/change-availability', {docID: docID}, {headers: { adminToken: adminToken }})
            if (data.success){
                toast.success("Doctor's Availablity Changed Successfully")
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getAllAppointments = async() => {
        try {
            const { data } = await axios.get(backendURL + '/api/admin/all-appointments', {headers: { adminToken: adminToken }})
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

    const getDashboardData = async() => {
        try {
            const { data } = await axios.get(backendURL + '/api/admin/dashboard-data', {headers: { adminToken: adminToken }})
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

    const value = {
        adminToken, setAdminToken, backendURL, doctors, 
        getAllDoctors, changeAvailability, appointments, 
        setAppointments, getAllAppointments, cancelAppointment,
        getDashboardData, dashboardData
    }

    return (
        <AdminContext.Provider value = {value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider