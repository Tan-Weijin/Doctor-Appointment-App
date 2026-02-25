import express from 'express'
import upload from '../middleware/multer.js'
import { doctorList, login, appointmentsDoctor, appointmentCompleted, 
        appointmentCancelled, doctorDashboard, getDoctorProfile, updateDoctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middleware/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/doctor-list', doctorList)
doctorRouter.post('/login', login)
doctorRouter.get('/doctor-appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/appointment-cancel', authDoctor, appointmentCancelled)
doctorRouter.post('/appointment-completed', authDoctor, appointmentCompleted)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/doctor-profile', authDoctor, getDoctorProfile)
doctorRouter.patch('/update-profile', authDoctor, updateDoctorProfile)

export default doctorRouter