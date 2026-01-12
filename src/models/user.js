const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Create a strong password: " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data  is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://pngtree.com/freepng/user-vector-avatar_4830521.html",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo url:" + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, secretKey, { expiresIn: "7d" });
    return token;
}
userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    return isPasswordValid;
}
module.exports = mongoose.model("User", userSchema)