require('dotenv').config();
const express = require('express');
const { userAuth } = require('../middleware/auth');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const connectDB = require('./config/database')
const app = express();
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
app.use('/', authRouter, profileRouter, requestRouter, userRouter)
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
// app.post('/sendconnectionrequest', userAuth, async (req, res) => {
//     try {
//         const user = req.user;
//         res.send(user.firstName + ' ' + 'Send connection request');
//     } catch (error) {
//         res.status(400).send("Error" + error?.message)
//     }
// })

connectDB().then(() => {
    console.log("Database connection established")
    app.listen(7777, () => {
        console.log("Server is successfully running on port")
    })
}).catch(err => {
    console.error('Database connection not established')
})
