const express = require("express")
require('dotenv').config
const app = express()
const port = process.env.PORT || 4000
const chats = require('./data')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoute')
const messageRoutes = require('./routes/messageRoutes')
require('./config/db')
const colors = require("colors")
const { notFound, errorHandler } = require("./middleWare/errorMiddleware")


app.use(express.json())
app.use("/api/user",userRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(port,(()=>{
    console.log(`server is running on port ${port}`.yellow.bold)
}))

const io = require('socket.io')(server,{
    pingTimeout :60000, 
    cors:{
        origin:"http://localhost:3000"

    }
})

io.on('connection',(socket)=>{
    console.log("user connected")

    socket.on("setup",(userData)=>{
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("User joined room " + room)
    })

    socket.on("typing",(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))

    socket.on("new message",(newMessageReceived)=>{
        var chat = newMessageReceived.chat

        if(!chat.users) return console.log(("chat.users not defined"))

        chat.users.forEach((user)=>{
            if(user._id === newMessageReceived.sender._id) return

            socket.in(user._id).emit("message received",newMessageReceived)
        })
         
    })

    socket.off("setup",()=>{
        console.log("USER DISCONNECTED")
        socket.leave(userData._id)
    })
})