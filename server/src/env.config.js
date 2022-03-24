const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
})

if (!process.env.DB_CONNECT || !process.env.JWT_SECRET || !process.env.PORT || !process.env.NODE_ENV) {
    console.error("Failed to load in env variable correctly"); 
    process.exit(1);
}

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development', 
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: parseInt(process.env.PORT),
    DB_CONNECT: process.env.DB_CONNECT
}