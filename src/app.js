const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");
const User = require("./models/user.model");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const { saltRounds } = require("./utils/constants");
const cookieParser = require('cookie-parser');
const { userAuth } = require("./middlewares/auth.middleware");

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

// signup api
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

// profile api
app.post("/profile", userAuth, async (req, res) => {
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