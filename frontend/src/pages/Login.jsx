import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const {backendURL, userToken, setUserToken} = useContext(AppContext)
  const navigate = useNavigate();
  const [loginState,setLoginState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    // prevent page reload
    event.preventDefault()
    try {
      if (loginState === "Sign Up"){
        const { data } = await axios.post(backendURL + '/api/user/register', {name, password, email})
        if (data.success){
          localStorage.setItem("userToken", data.userToken)
          setUserToken(data.userToken)
          toast.success("Successfully Registered User")
          setLoginState("Log In")
        } else {
          toast.error("Error Registering User")
        }
      } else if (loginState === "Log In"){
        const { data } = await axios.post(backendURL + '/api/user/login', {password, email})
        if (data.success){
          localStorage.setItem("userToken", data.userToken)
          setUserToken(data.userToken)
          toast.success("Log In Successfull")
          navigate('/')
        } else {
          toast.error("Error Registering User")
        }
      } else {
        toast.error("Incorrect Login State provided")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (userToken){
      navigate('/')
    }
  }, [userToken])
  
  return (
    <form onSubmit = {onSubmitHandler} className = 'min-h-[80vh] flex items-center'>
      <div className = 'flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className = 'text-2xl font-semibold'>{loginState === "Sign Up" ? "Create Account" : "Login"}</p>
        <p>Please {loginState === "Sign Up" ? "sign up" :" login "} to book appointment</p>
        {
          loginState === "Sign Up" &&
          <div className = 'w-full'>
            <p>Full Name</p>
            <input className = 'border border-zinc-300 rounded w-full p-2 mt-1' type = "text" onChange={(e) => setName(e.target.value)} value = {name} required/>
          </div>
        }
        <div className = 'w-full'>
          <p>Email</p>
          <input className = 'border border-zinc-300 rounded w-full p-2 mt-1' type = "text" onChange={(e) => setEmail(e.target.value)} value = {email} required/>
        </div>
        <div className = 'w-full'>
          <p>Password</p>
          <input className = 'border border-zinc-300 rounded w-full p-2 mt-1' type = "password" onChange={(e) => setPassword(e.target.value)} value = {password} required/>
        </div>
        <button className = 'bg-primary text-white w-full py-2 rounded-md text-base' type = "submit">{loginState === "Sign Up" ? "Create Account" : "Login"}</button>
        {
          loginState === "Sign Up" 
          ? <p>Already have an account? <span onClick = {()=>{setLoginState("Log In")}} className = 'text-primary underline cursor-pointer'>Login Here</span></p> 
          : <p>Create a new account? <span onClick = {()=>{setLoginState("Sign Up")}} className = 'text-primary underline cursor-pointer'>Click Here</span></p>
        }
      </div>
    </form>
  )
}

export default Login