import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import bycrpt from 'bcrypt'
import jwt from 'jsonwebtoken'

const changeAvailability = async (req,res) => {
    try {

        const{docID} = req.body
        const docData = await doctorModel.findById(docID)
        await doctorModel.findByIdAndUpdate(docID, {available: !docData.available})
        return res.json({success:true, message: "Doctor's availablity changed"})
        
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const doctorList = async (req,res) => {
    try {
        const doctor = await doctorModel.find({}).select(['-password', '-email'])
        return res.json({success:true, doctor})

    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const login = async(req,res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({email})
        if (!doctor){
            return res.json({success:false, message: "Invalid Email"})
        }
        const isMatch = await bycrpt.compare(password, doctor.password)
        if (isMatch){
            const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET)
            res.json({success:true, token})
        } else {
            return res.json({success:false, message: "Invalid Password"})
        }
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const appointmentsDoctor = async (req,res) => {
    try {
        const { doctorID } = req.user
        const appointments = await appointmentModel.find({docID: doctorID})

        return res.json({success:true, appointments})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const appointmentCompleted = async(req,res) => {
    try {
        const { doctorID } = req.user
        const { appointmentID } = req.body

        const appointmentData = await appointmentModel.findById(appointmentID)

        if (appointmentData && appointmentData.docID === doctorID){
            await appointmentModel.findByIdAndUpdate(appointmentID, {isCompleted: true})
        } else {
            return res.json({success:false, message: "Error updating appointment status"})

        }

        return res.json({success:true, message:"Successfully Completed Appointment"})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const appointmentCancelled = async(req,res) => {
    try {
        const { doctorID } = req.user
        const { appointmentID } = req.body

        const appointmentData = await appointmentModel.findById(appointmentID)

        if (appointmentData && appointmentData.docID === doctorID){
            await appointmentModel.findByIdAndUpdate(appointmentID, {cancelled: true})
        } else {
            return res.json({success:false, message: "Error updating appointment status"})

        }

        return res.json({success:true, message:"Successfully Cancelled Appointment"})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const doctorDashboard = async (req,res) => {
    try {
        const { doctorID } = req.user
        const appointments = await appointmentModel.find({docID: doctorID})
        let earnings = 0
        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings += item.amount
            }
        })
        let patients = []
        appointments.map((item)=>{
            if (!patients.includes(item.userID)){
                patients.push(item.userID)
            }
        })

        const dashboardData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        return res.json({success:true, dashboardData})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const getDoctorProfile = async (req,res) =>{
    try {
        const { doctorID } = req.user
        const profileData = await doctorModel.findById(doctorID).select('-password')
        return res.json({success:true, profileData})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const updateDoctorProfile = async (req,res) => {
    try {
        const { doctorID } = req.user
        const { fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(doctorID, { fees, address, available })
        return res.json({success:true, message: "Successfully Updated Doctor Profile"})
    } catch (error) {
       console.log(error)
        return res.json({success:false, message: error.message}) 
    }
}

export {changeAvailability, doctorList, login, appointmentsDoctor, 
    appointmentCompleted, appointmentCancelled, doctorDashboard, 
    getDoctorProfile, updateDoctorProfile}