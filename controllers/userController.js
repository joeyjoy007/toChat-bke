const expressAsyncHandler = require("express-async-handler")
const res = require("express/lib/response")
const generateToken = require("../config/generateToken")
const User = require('../models/UserMode')

const registerUser =expressAsyncHandler (async(req,res)=>{
    const{name,email,password,pic} = req.body

    if(!name || !email || !password){
        res.status(400);
        throw new Error("please enter all fields")
    }

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400);
        throw new Error("user already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
        pic

    })
    if(user){
        res.status(200).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new Error("user not created")
    }
})




const authUser = expressAsyncHandler(async(req,res)=>{

    const {email,password} = req.body

    const user = await User.findOne({email})
    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user.id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(401)
        throw new Error("invalid credentials")
    }

})

//search
const allUser = expressAsyncHandler(async(req,res)=>{
    const keyword = req.query.search ?
    {
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ]
    }:{}

    const users = await User.find(keyword).find({_id:{$ne :req.user._id}})
    res.send(users)
})

module.exports = {registerUser,authUser,allUser}