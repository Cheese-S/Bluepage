
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./db')
const env = require('./env.config')
const routes = require('./routes')
const { logger } = require('bs-logger')

if (!env.DB_CONNECT || !env.JWT_SECRET || !env.PORT) {
    console.log(env);
    console.error("Failed to load in env variable correctly"); 
    process.exit(1);
}




const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://localhost:3000"], // Placeholder
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

routes(app);


app.listen(env.PORT, async () => {
    logger(`App is running at http://localhost:${env.PORT}`);
})





