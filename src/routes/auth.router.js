const express = require("express");
const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const { saltRounds } = require("../utils/constants");
const { validateSignupData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth.middleware");

const authRouter = express.Router();

// signup api
authRouter.post("/signup", async (req, res) => {
    try {
        // validate the data
        validateSignupData(req.body);

        const { firstName, lastName, email, password, gender, age } = req.body;

        // find if the user already exists
        const findUserByEmail = await User.findOne({ email });

        if (findUserByEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // hash password
        const hash = await bcrypt.hash(password, saltRounds);

        await User.create({
            firstName,
            lastName,
            email,
            gender,
            password: hash, // need to hash
            age
        });

        return res.status(201).json({
            message: "User created successfully"
        })
    } catch (error) {
        console.log("Error saving the user ", error.message);
        return res.status(400).json({
            message: error.message || "Something went wrong"
        })
    }
})

// login api
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const findUser = await User.findOne({ email });

        if (!findUser) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const isPasswordMatch = await findUser.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        // token generation
        const token = findUser.getJWT();

        // save it in cookie
        res.cookie('token', token, { secure: true });
        return res.status(200).json({
            message: "Logged in successfully"
        })
    } catch (error) {
        console.log("login error ", error.message);
        return res.status(400).json({
            message: error.message || "Something went wrong"
        })
    }
})

// logout
authRouter.post("/logout", userAuth, async (req, res) => {
    try {
        // clear cookie
        res.clearCookie('token');

        return res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log("Logout error: ", error.message);
        return res.status(400).json({
            message: error.message || "Failed to logout"
        })
    }
})
module.exports = {
    authRouter
}