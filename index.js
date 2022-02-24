const express = require("express")
require('dotenv').config
const app = express()
const port = process.env.PORT || 4000
const chats = require('./data')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoute')
require('./config/db')
const colors = require("colors")
const { notFound, errorHandler } = require("./middleWare/errorMiddleware")


app.use(express.json())
app.use("/api/user",userRoutes)
app.use("/api/chat",chatRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port,(()=>{
    console.log(`server is running on port ${port}`.yellow.bold)
}))
