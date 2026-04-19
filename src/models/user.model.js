const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "Firstname is required"],
        minLength: [2, "Minimum 2 characters required"],
        maxLength: [200, "Cannot exceed 200 characters"]
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            message: "Invalid email format"
        }
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female', "Others"],
            message: "Value not supported"
        },
    },
    age: {
        type: Number,
        min: [18, "Must be atleast 18"],
        max: [120, "Enter a valid number. Cannot exceed 120"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Enter atleast 6 characters"],
        maxLength: [200, "Password cannot exceed 200 characters"],
        validate: {
            validator: function (password) {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
                return passwordRegex.test(password);
            },
            message: "Invalid password format - At least 1 lowercase, 1 uppercase, 1 number. Allows common special characters"
        }
    },
    profilePicture: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/default-profile-picture-icon-high-resolution-high-resolution-default-profile-picture-icon-symbolizing-no-display-picture-360167031.jpg"
    },
    about: {
        type: String,
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;