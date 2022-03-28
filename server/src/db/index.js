const env = require('../env.config')
const mongoose = require('mongoose')
const logger = require('bs-logger')
const { logger } = require('bs-logger')

mongoose
    .connect(env.DB_CONNECT)
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

logger(`Database connected sucessfully with route ${env.DB_CONNECT}`);

module.exports = db