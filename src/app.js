const express = require("express");

// create app
const app = express();
const PORT = process.env.PORT || 7777;

app.get("/", (req, res) => {
    return res.json("Welcome to dev tinder backend🚀");
})

app.listen(PORT, () => {
    console.log("Server is listening on PORT", PORT, "🚀🚀");
})