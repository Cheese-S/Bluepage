const env = require('../env.config')
const mongoose = require('mongoose')

mongoose
    .connect(env.DB_CONNECT)
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db