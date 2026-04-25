
const express = require("express");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user.model");

const userRouter = express.Router();

// profile api
userRouter.get("/", async (req, res) => {
    try {
        const findUser = req.user;

        return res.json({
            user: findUser
        })
    } catch (error) {
        console.log("Error in profile api ", error.message);
        return res.status(400).json({
            message: error.message || "Something went wrong"
        })
    }
})

userRouter.patch("/edit", async (req, res) => {
    try {
        const body = req.body;
        const user = req.user;
        console.log(req.body);

        if (!body || Object.keys(body)?.length === 0) {
            return res.status(400).json({
                message: "No new fields"
            })
        }

        const newUpdatedData = validateEditProfileData(body);
        const updatedUser = await User.findByIdAndUpdate(user._id, newUpdatedData, {
            returnDocument: "after"
        });

        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        })
    } catch (error) {
        console.log("Error in profile edit api ", error.message);
        return res.status(400).json({
            message: error.message || "Something went wrong"
        })
    }
})

userRouter.patch("/password", async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        const loggedInUser = req.user;

        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            })
        }

        const isPasswordMatch = loggedInUser.comparePassword(password, loggedInUser.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Password doesnt match"
            })
        }

        // validate password
        const isValidPassword = validator.isStrongPassword(newPassword);
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Enter a strong password"
            })
        }

        // hash password
        const hash = await bcrypt.hash(newPassword, saltRounds);

        await User.findByIdAndUpdate(loggedInUser._id, {
            password: hash
        });

        return res.status(200).json({
            message: "Password updated successfully"
        })
    } catch (error) {
        console.log("Error in password change api ", error.message);
        return res.status(400).json({
            message: error.message || "Something went wrong"
        })
    }
})

module.exports = {
    userRouter
}