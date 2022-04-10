const env = require('../env.config')
const mongoose = require('mongoose')
const { logger } = require('bs-logger')



mongoose
    .connect(env.DB_CONNECT)
    .catch(e => {
        console.error('Connection error', e.message)
    })

mongoose.connection.on('connect', function () {
    logger(`Database connected sucessfully with route ${env.DB_CONNECT}`)
})

const db = mongoose.connection



module.exports = db