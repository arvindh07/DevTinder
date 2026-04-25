const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");
const User = require("./models/user.model");
const validator = require('validator');
const { validateSignupData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const { saltRounds } = require("./utils/constants");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

// load dotenv
dotenv.config();

// create app
const app = express();
const PORT = process.env.PORT || 7777;

// middlewares
app.use(express.json());
app.use(cookieParser())

// Apis
app.get("/", (req, res) => {
    return res.json("Welcome to dev tinder backend🚀");
})

app.post("/signup", async (req, res) => {
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

// get user by email
app.post("/user", async (req, res) => {
    try {
        const { email } = req.body;
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.json({
            user: findUser
        })
    } catch (error) {
        console.log("Error in user api ", error.message);
        return res.status(400).json({
            message: error.message || "Something went wrong"
        })
    }
})

// feed api
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        return res.json({
            users
        })
    } catch (error) {
        console.log("Error in feed api ", error.message);
        return res.status(400).json({
            message: error.message || "Something went wrong"
        })
    }
})

// delete api
app.delete("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const findUser = await User.findByIdAndDelete(id);

        if (findUser) {
            return res.json({
                message: "User deleted successfully"
            })
        }

        return res.json({
            message: "Already deleted"
        })
    } catch (error) {
        console.log("Error in delete user api ", error.message);
        return res.status(400).json({
            message: error.message || "Something went wrong"
        })
    }
})

// patch api
app.patch("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};

        // remove email
        const allowedUpdates = ["profilePicture", "gender", "about", "skills"];
        const finalPayload = {};

        for (const key in body) {
            const element = body[key];
            if (allowedUpdates.includes(key)) {
                finalPayload[kye] = element;
            }
        }

        if (body?.profilePicture) {
            if (!validator.isURL(body?.profilePicture)) {
                return res.status(400).json({ message: "Profile picture is not valid URL" });
            }
        }

        await User.findByIdAndUpdate(id, finalPayload, {
            runValidators: true
        });

        return res.json({
            message: "User updated successfully"
        })
    } catch (error) {
        console.log("update error ", error.message);
        return res.status(400).json({
            message: error.message || "Something went wrong"
        })
    }
})

// login api
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const findUser = await User.findOne({ email });

        if (!findUser) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, findUser.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        // token generation
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: findUser._id
        }, process.env.JWT_SECRET);

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

// profile api
app.post("/profile", async (req, res) => {
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

// Unexpected error handling
app.use((err, req, res, next) => {
    if (err) {
        console.log("Last error ", err);
        return res.status(500).send("Internal Server Error");
    }
    next();
})

// connect to db
connectToDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Connected to DB and Server is listening on PORT", PORT, "🚀🚀");
        })
    })
    .catch((err) => console.log("Db error ", err))