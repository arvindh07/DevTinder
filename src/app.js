const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");
const cookieParser = require('cookie-parser');
const { userAuth } = require("./middlewares/auth.middleware");
const { authRouter } = require("./routes/auth.router");
const { requestRouter } = require("./routes/connectionRequest.router");
const { userRouter } = require("./routes/user.router");

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

app.use("/auth", authRouter);
app.use("/profile", userAuth, userRouter);
app.use("/request", userAuth, requestRouter);

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