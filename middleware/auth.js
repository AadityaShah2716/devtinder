require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../src/models/user');
const secretKey = process.env.SECRET_KEY;

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error('Token is not valid')
        }
        const decodeobj = jwt.verify(token, secretKey);
        const { _id } = decodeobj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error('User not found');
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send('ERROR:' + error?.message)
    }

}
module.exports = { userAuth } 