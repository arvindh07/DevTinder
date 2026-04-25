
const express = require("express");

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

module.exports = {
    userRouter
}