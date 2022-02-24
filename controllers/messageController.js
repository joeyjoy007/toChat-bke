const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require('../models/messageModel');
const User = require("../models/UserMode");

const sendMessage = expressAsyncHandler(async(req,res)=>{
    const {content,chatId} = req.body

    if(!content || !chatId){
        console.log("Invali ddata passes")
        res.sendStatus(400)
    }

    var newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatId
    }

    try {

        var message = await Message.create(newMessage)

        message = await message.populate('sender',"name pic")
        message = await message.populate('chat')
        message = await User.populate(message,{
            path:"chat.users",
            select:"name pic email"

        })

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message

        })

        res.json(message)

        
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const AllMessage = expressAsyncHandler(async(req,res)=>{


    try {
        const message = await Message.find({chat:req.params.chatId}).populate("sender","name pic").populate('chat')
    res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
        
    }
    
})

module.exports ={ sendMessage,AllMessage}