import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = "$"
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])
    const [userToken, setUserToken] = useState(localStorage.getItem("userToken") ? localStorage.getItem("userToken") : false)
    const [userData, setUserData]=  useState(false)

    const getDoctors = async () =>{
        try {
            const { data } = await axios.get(backendURL + '/api/doctor/doctor-list')
            console.log(data)
            if (data.success){
                setDoctors(data.doctor)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/user/details', {headers:{userToken: userToken}})
            if (data.success){
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        doctors,
        currencySymbol,
        userToken,
        setUserToken,
        backendURL,
        userData,
        setUserData,
        getUserData,
        getDoctors
    }


    useEffect(()=>{
        getDoctors()
    },[])

    useEffect(()=>{
        if (userToken){
            getUserData()
        } else {
            setUserData(false)
        }
    },[userToken])

    return(<AppContext.Provider value = {value}>
        {props.children}
    </AppContext.Provider>)
}

export default AppContextProvider