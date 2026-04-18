const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");
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
    try {
        const { firstName, lastName, email, password } = req.body;

        // check empty validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Fields are required" });
        }

        // hash password
        // find if the user already exists
        const findUserByEmail = await User.findOne({ email });

        if (findUserByEmail) {
            return res.status(400).json({ message: "Email already exists" });
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
    }
})

// patch api
app.patch("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        await User.findByIdAndUpdate(id, body);

        return res.json({
            message: "User updated successfully"
        })
    } catch (error) {
        console.log("update error ", error.message);
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