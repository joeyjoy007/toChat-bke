const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/talkEtive').then(()=>{
    console.log("dataBase connected".blue.bold)
}).catch((err)=>{
    console.log(err)
})

module.exports = mongoose