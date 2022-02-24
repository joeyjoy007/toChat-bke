const jwt = require('jsonwebtoken')


const generateToken = (id)=>{
    return jwt.sign({id},"GARVITJAIN",{
        expiresIn:"30d"
    })
}

module.exports = generateToken