import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_admin/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setAdminToken, backendURL} = useContext(AdminContext);
  const {setDoctorToken} = useContext(DoctorContext)
  const navigate = useNavigate();

  const onSubmitHandler = async (event) =>{
    event.preventDefault()
    try{
        if (state === 'Admin'){
          const {data} = await axios.post(backendURL + '/api/admin/login', {email: email, password: password})
          if (data.success == true){
            localStorage.setItem('adminToken', data.token)
            setAdminToken(data.token)
            console.log("User Login")
            navigate('/admin-dashboard')
          } else {
            toast.error(data.message)
          }
        } else if (state === 'Doctor') {
            const {data} = await axios.post(backendURL + '/api/doctor/login', {email: email, password: password})
            if (data.success == true){
              localStorage.setItem('doctorToken', data.token)
              setDoctorToken(data.token)
              console.log("User Login")
              navigate('/doctor-dashboard')
            } else {
              toast.error(data.message)
            }
        } else {
          toast.error('Invalid user role selected')
        }

    } catch(error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className = "min-h-[80vh] flex items-center">
      <div className = "flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className = "text-2xl font-semibold m-auto">
          <span>{state}</span> Login{" "}
        </p>
        <div className = "w-full">
          <p>Email</p>
          <input onChange = {(e)=>setEmail(e.target.value)} value = {email} className = "border border-zinc-300 rounded w-full p-2 mt-1" type="email" required />
        </div>
        <div className = "w-full">
          <p>Password</p>
          <input onChange = {(e)=>setPassword(e.target.value)} className = "border border-zinc-300 rounded w-full p-2 mt-1" type="password" required />
        </div>
        <button className = "bg-primary text-white w-full py-2 rounded-md text-base">Login</button>
        {
            state === 'Admin'
            ? <p>Doctor Login? <span className = "text-primary underline cursor-pointer" onClick={()=>{setState("Doctor")}}>Click Here</span></p>
            : <p>Admin Login? <span className = "text-primary underline cursor-pointer" onClick={()=>{setState("Admin")}}>Click Here</span></p>
        }
      </div>
    </form>
  );
};

export default Login;
