const expressAsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/UserMode')


const protect = expressAsyncHandler(async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer") ){

        try {
            
            token = req.headers.authorization.split(" ")[1];

            const decode = await jwt.verify(token,"GARVITJAIN")

            req.user = await User.findById(decode.id).select("-password")

            next()
            
        } catch (error) {
            res.status(400)
            throw new Error("Failed")
        }
    }

    if(!token){
        res.status(400)
        throw new Error("Not authorized")
    }
})

module.exports = protect