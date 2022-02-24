const expressAsyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require("../models/UserMode");

const accessChat = expressAsyncHandler(async(req,res)=>{

    const {userId} = req.body

    if(!userId){
        console.log(("userid param not send with request"))
        return res.sendStatus(400)
    }

    // if Chat already exist
    var isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate("users","-password").populate("latestMessage")

    console.log(isChat)

    isChat = await User.populate(isChat,{
        path:"latestChat.sender",
        select:"name pic email"
    })

    if(isChat.length >0 ){
        res.send(isChat[0])
    }else{
        var chatData = {
            isGroupChat:false,
            chatName:"sender",
            users:[req.user._id,userId]
        }
        try {
            const createChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({_id:createChat._id}).populate("users","-password")

            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
            
        }
    }

})

const fetchUser = expressAsyncHandler(async(req,res)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).
        populate("users","-password").
        populate("groupAdmin","-password").
        populate("latestMessage").sort({updatedAt : -1}).
        then(async (results)=>{
           
            results = await User.populate(results,{
                path:"latestMessage.sender",
                select:"name email pic"
            })
            res.status(200).send(results)
        })
        
        
    } catch (error) {
        res.status(401).json({
            message:error.message
        })
    }
})


const createGroupChat = expressAsyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"Please fill all the fields"})
    }

    var users = JSON.parse(req.body.users)

    if(users.length < 2){
        return res.status(401).json({message:"More than 2 users required for create group"})
    }

    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            chatName:req.body.name,
            isGroupChat:true,
            users:users,
            groupAdmin:req.user
        })

        const fullChat = await Chat.findOne({_id:groupChat._id}).populate("users","-password").populate("groupAdmin","-password")
        res.status(200).send(fullChat)
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
        
    }
})

const renameGroup = expressAsyncHandler(async(req,res)=>{
    const {chatId,chatName} = req.body

 try {
    const updateChat = await Chat.findByIdAndUpdate(chatId,{
        chatName

    },{
        new:true
    }).populate('users',"-password").populate('groupAdmin',"-password")

    if(!updateChat){
        res.status(400).json({message:"group name not updated"})
    }

    res.status(200).json({message:"group name updated",
updateName:updateChat
})
 } catch (error) {
     res.status(400).json({
         message:error.message
     })
 }
})


const addToGroup = expressAsyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body

    const added = await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId}
    },
    {
        new:true
    }).populate('users',"-password").populate('groupAdmin',"-password");

    if(!added){
        throw new Error("user not added")
    }
    else{
        res.json(added)
    }
})


const removeFromGroup = expressAsyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body

    const remove = await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId}
    },
    {
        new:true
    }).populate('users',"-password").populate('groupAdmin',"-password");

    if(!remove){
        throw new Error("user not added")
    }
    else{
        res.json(remove)
    }
})
module.exports= {accessChat,fetchUser,createGroupChat,renameGroup,addToGroup,removeFromGroup}