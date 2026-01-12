const express = require('express');
const User = require('../models/user');
const { validateSignupData } = require('../utils/validation')
const authRouter = express.Router();
const bcrypt = require('bcrypt');
authRouter.post('/signup', async (req, res) => {
    try {
        validateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("User Added Successfully")
    } catch (err) {
        res.status(400).send("Error saving the user:" + err.message)
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error('Invalid credential');
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send('Login Successfull');
        }
        else {
            throw new Error('Invalid credential');
        }
    } catch (error) {
        res.status(400).send("Error:" + error.message)
    }
})

authRouter.post('/logout', async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).send('Logout Successfull');
})

module.exports = authRouter;    