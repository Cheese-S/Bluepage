const { logger } = require('bs-logger')
const { 
    registerSchema,
    changePwdSchema,
    followUserSchema,
    loginSchema
} = require('./user.schema')

module.exports = {
    registerUser: registerSchema,
    changeUserPwd: changePwdSchema,
    followUser: followUserSchema,
    loginUser: loginSchema
}