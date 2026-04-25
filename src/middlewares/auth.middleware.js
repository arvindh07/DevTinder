const User = require("../models/user.model");
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            throw new Error("Invalid token");
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded?.data;

        const findUser = await User.findById(id);
        if (!findUser) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        req.user = findUser;
        next();
    } catch (error) {
        console.log("auth error: ", error.message);
        return res.status(400).json({
            message: error.message || "Something went wrong"
        })
    }
}

module.exports = {
    userAuth
}