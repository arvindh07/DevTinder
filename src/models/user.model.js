const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
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
        lowercase: true
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
        trim: true,
        required: [true, "Password is required"],
        minLength: [8, "Enter atleast 8 characters"],
        maxLength: [64, "Password cannot exceed 200 characters"]
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

userSchema.methods.getJWT = function () {
    try {
        const findUser = this;
        const token = jwt.sign({
            data: findUser._id
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        return token;
    } catch (error) {
        console.log("get jwt err ", error.message);
    }
}

userSchema.methods.comparePassword = async function (password) {
    const isPasswordMatch = await bcrypt.compare(password, this.password);
    return isPasswordMatch;
}

const User = mongoose.model("User", userSchema);

module.exports = User;