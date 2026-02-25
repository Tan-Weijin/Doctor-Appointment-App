import express from 'express'
import { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, cancelAppointment, adminDashboard } from '../controllers/adminController.js'
import upload from '../middleware/multer.js'
import authAdmin from '../middleware/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.get('/all-doctors', authAdmin , allDoctors)
adminRouter.put('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/all-appointments', authAdmin , appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, cancelAppointment)
adminRouter.get('/dashboard-data', authAdmin, adminDashboard)

export default adminRouter