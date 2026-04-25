const validator = require('validator');

const validateSignupData = (data) => {
    const { firstName, email, password } = data;

    if (!firstName || !email || !password) {
        throw new Error("Firstname, email and password are required");
    }

    if (!firstName) {
        throw new Error("Firstname is required");
    }

    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) {
        throw new Error("Email is not valid");
    }

    const isValidPassword = validator.isStrongPassword(password);
    if (!isValidPassword) {
        throw new Error("Enter a strong password");
    }
}

const validateEditProfileData = (data) => {
    const allowedFieldEdits = ["firstName", "lastName", "gender", "age", "profilePicture", "about", "skills"];
    const finalPayload = {};
    for (const key in data) {
        const element = data[key];

        if(allowedFieldEdits.includes(key)) {
            finalPayload[key] = element;
        }
    }

    return finalPayload;
}

module.exports = { validateSignupData, validateEditProfileData };