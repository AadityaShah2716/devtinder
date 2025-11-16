const mongoose = require('mongoose');
const connectDB = async () => {
    await mongoose.connect('mongodb+srv://Aadi:Aadi123@namastenodejs.ozqr5sj.mongodb.net/devTinder')
}

module.exports = connectDB;
