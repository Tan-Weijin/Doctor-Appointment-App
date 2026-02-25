import jwt from 'jsonwebtoken'

// Doctor authentication middleware

const authDoctor = async(req,res,next) => {
    try{
        const {doctortoken} = req.headers
        if (!doctortoken){
            return res.json({success:false, message: "Doctor is not authorized. Please login again"})
        }
        const token_decode = jwt.verify(doctortoken, process.env.JWT_SECRET)
        req.user = { 
            doctorID: token_decode.id 
        }
        next();
    } catch(error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

export default authDoctor