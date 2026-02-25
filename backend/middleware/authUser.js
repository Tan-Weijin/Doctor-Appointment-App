import jwt from 'jsonwebtoken'

// User authentication middleware

const authUser = async(req,res,next) => {
    try{
        const {usertoken} = req.headers
        if (!usertoken){
            return res.json({success:false, message: "User is not authorized. Please login again"})
        }
        const token_decode = jwt.verify(usertoken, process.env.JWT_SECRET)
        req.user = { 
            userID: token_decode.id 
        }
        next();
    } catch(error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

export default authUser