import express from 'express'
import upload from '../middleware/multer.js'
import authUser from '../middleware/authUser.js'
import { registerUser, loginUser, getUserDetails, updateUserDetails, bookAppointment, getAppointments, cancelAppointment } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/details', authUser, getUserDetails)
userRouter.patch('/update-details', authUser, upload.single('image'), updateUserDetails)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, getAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)

export default userRouter