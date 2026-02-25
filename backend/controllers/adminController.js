import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js'
import appointmentModel from '../models/appointmentModel.js'
import jwt from 'jsonwebtoken'

const addDoctor = async(req,res)=>{
    try{
        const { name, email, password, speciality, education, experience, about, fees, address} = req.body
        const imageFile = req.file
        const requiredFields = [
            name,
            email,
            password,
            speciality,
            education,
            experience,
            about,
            fees,
            address
        ];

        if (!requiredFields){
            return res.json({success:false, message:"Missing Details"})
        }
        if (!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email"})
        }
        if (password.length < 8){
            return res.json({success:false, message:"Password length must be at least 8"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
        const imageURL = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageURL,
            password: hashedPassword,
            speciality,
            education,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        return res.json({success:true, message:"Doctor added successfully"})

    } catch(error){
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const loginAdmin = async (req,res) =>{
    try {
        const {email, password} = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            return res.json({success:true, token})
        } else {
            return res.json({success:false, message:"Invalid Credentials"})
        }
    } catch(error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const allDoctors = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select('-password')
        return res.json({success:true, doctors})
        
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const appointmentsAdmin = async(req,res) => {
    try {
        const appointments = await appointmentModel.find({})
        return res.json({success:true, appointments})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const cancelAppointment = async(req,res) => {
    try {
        const { appointmentID } = req.body

        const appointmentData = await appointmentModel.findById(appointmentID)
        await appointmentModel.findByIdAndUpdate(appointmentID, {cancelled: true})

        const {docID, slotDate, slotTime} = appointmentData
        
        const doctorData = await doctorModel.findById(docID)
        let slots_booked = doctorData.slotsBooked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docID, {slotsBooked: slots_booked})

        return res.json({success:true, message:"Successfully cancelled the appointment"})
        
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const adminDashboard = async(req,res) => {
    try {
        const doctors = await doctorModel.find({})
        const patients = await userModel.find({})
        const appointment = await appointmentModel.find({})

        const dashboardData = {
            doctors: doctors.length,
            appointments: appointment.length,
            patients: patients.length,
            latestAppointments: appointment.reverse().slice(0,5)
        }

        return res.json({success:true, dashboardData})
        
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

export {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, cancelAppointment, adminDashboard}