const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");
const { mongoose } = require("mongoose");
const User = require("./models/user.model");

// load dotenv
dotenv.config();

// create app
const app = express();
const PORT = process.env.PORT || 7777;

// middlewares
app.use(express.json());

// Apis
app.get("/", (req, res) => {
    return res.json("Welcome to dev tinder backend🚀");
})

app.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // check empty validation
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Fields are required" });
    }


    // hash password
    try {
        // find if the user already exists
        const findUserByEmail = await User.find({ email });

        if (!findUserByEmail) {
            return res.status(400).json({ message: "User already exists" });
        }
        await User.create({
            firstName,
            lastName,
            email,
            password, // need to hash
        });

        return res.status(201).json({
            message: "User created successfully"
        })
    } catch (error) {
        console.log("Error saving the user ", error.message);
    }
})

// Unexpected error handling
app.use("/", (err, req, res, next) => {
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