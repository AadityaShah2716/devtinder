const express = require('express');
const { userAuth } = require('../../middleware/auth');
const { validateProfileData } = require('../utils/validation');
const profileRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("Error" + error?.message)
    }
})

profileRouter.patch('/updateprofile', userAuth, async (req, res) => {
    try {
        if (!validateProfileData(req)) {
            throw new Error('Invalid Profile request');
        }
        const user = req?.user;
        const validupdateprofile = Object.keys(req.body).forEach((key) => {
            user[key] = req.body[key];
        });

        await user.save();
        res.send("User data updated successfully");
        return validupdateprofile

    } catch (error) {
        res.status(400).send("Error" + error?.message)
    }
})

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const { emailId, password, newpassword } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error('Invalid credential');
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const passwordHash = await bcrypt.hash(newpassword, 10);

            user.password = passwordHash;
            await user.save();
            res.send("User New password Added")
        }

    } catch (error) {
        res.status(400).send("Error saving the user:" + error.message)
    }
})

module.exports = profileRouter;