const { logger } = require('bs-logger')
const { 
    registerSchema,
    changePwdSchema
} = require('./user.schema')

module.exports = {
    registerUser: registerSchema,
    changeUserPwd: changePwdSchema 
}