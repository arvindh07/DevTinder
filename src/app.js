const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");

// load dotenv
dotenv.config();

// create app
const app = express();
const PORT = process.env.PORT || 7777;

app.get("/", (req, res) => {
    return res.json("Welcome to dev tinder backend🚀");
})

// Unexpected error handling
app.use("/", (err, req, res, next) => {
    if(err) {
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
    .catch((err) => console.log("Db error"))