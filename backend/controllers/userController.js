import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

const registerUser = async (req,res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password){
            return res.json({success:false, message: "Missing User Details"})
        }
        
        if (!validator.isEmail(email)){
            return res.json({success:false, message:"Please provide a valid email"})
        }

        if (password.length < 8){
            return res.json({success:false, message:"Please enter a stronger password"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name, 
            email, 
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        return res.json({success:true, userToken: token})


    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const loginUser = async (req,res) => {
    try {

        const {email, password} = req.body
        const user = await userModel.findOne({email})

        if (!user){
            return res.json({success:false, message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            return res.json({success:true, userToken: token})
        } else {
            return res.json({success:false, message: "Invalid Credentials"})
        }
        
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const getUserDetails = async (req,res)=>{
    try {
        const { userID } = req.user
        const userData = await userModel.findById(userID).select('-password')

        return res.json({success:true, userData})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const updateUserDetails = async (req,res) =>{
    try {
        const { name, phone, address ,dob, gender } = req.body
        const { userID } = req.user
        const imageFile = req.file

        if (!name || !phone || !address || !dob || !gender){
            return res.json({success:false, message: "Missing User Data"})
        }

        let updateData = { name, phone, dob, gender };

        // Only parse address if it exists
        if (address) {
            try {
                updateData.address = JSON.parse(address);
            } catch (error) {
                throw new Error("Invalid address format");
            }
        }
        // Only update image if a new one is provided
        if (imageFile) {
            try {
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
                updateData.image = imageUpload.secure_url;
            } catch (error) {
                throw new Error("Image upload failed: " + error.message);
            }
        }

        await userModel.findByIdAndUpdate(userID, updateData)

        res.json({success:true, message: "User Details Updated"})


    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }

}

const bookAppointment = async (req,res) =>{
    try {
        
        const {userID} = req.user
        const {docID, slotDate, slotTime} = req.body

        const docData = await doctorModel.findById(docID).select('-password')
        
        if (!docData.available){
            return res.json({success:false, message: "Doctor is not available at this time"})
        }

        let slotsBooked = docData.slotsBooked
        if (!slotsBooked) {
            slotsBooked = {};
        }

        if (slotsBooked[slotDate]){
            if (slotsBooked[slotDate].includes(slotTime)){
                return res.json({success:false, message: "Booking slot is not available"})
            } else {
                slotsBooked[slotDate].push(slotTime)
            }
        } else {
            slotsBooked[slotDate] = []
            slotsBooked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userID).select('-password')

        delete docData.slotsBooked

        const appointmentData = {
            userID,
            docID,
            slotTime,
            slotDate,
            userData,
            docData,
            amount: docData.fees,
            date: Date.now(),
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        await doctorModel.findByIdAndUpdate(docID, {slotsBooked})

        return res.json({success:true, message: "Appointment Successfully Booked"})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const getAppointments = async(req,res) => {
    try {
        const {userID} = req.user
        const userAppointments = await appointmentModel.find({userID})

        return res.json({success:true, userAppointments})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message})
    }
}

const cancelAppointment = async(req,res) => {
    try {
        const {userID} = req.user
        const {appointmentID} = req.body

        const appointmentData = await appointmentModel.findById(appointmentID)
        if (appointmentData.userID !== userID){
            return res.json({success:false, message: "Unauthorized action"})
        }
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

export {registerUser,loginUser,getUserDetails,updateUserDetails,bookAppointment,getAppointments,cancelAppointment}