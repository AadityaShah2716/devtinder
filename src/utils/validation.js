const validator = require('validator');
const validateSignupData = (req) => {
   const { firstName, lastName, emailId, password } = req.body;
   if (!firstName || !lastName) {
      throw new Error("Name is not valid");
   }
   else if (!validator.isEmail(emailId)) {
      throw new Error("Email is not valid");
   }
   else if (!validator.isStrongPassword(password)) {
      throw new Error("Please enter a strong password")
   }
};

const validateProfileData = (req) => {
   const allowedfield = ["firstName", "lastName", "password", "gender", "photoUrl", "about", "skills"];
   const isAllowed = Object.keys(req.body).every((field) => allowedfield.includes(field));
   return isAllowed
}

module.exports = { validateSignupData, validateProfileData };