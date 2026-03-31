const mongoose = require("mongoose");

async function connectToDB() {
    await mongoose.connect(process.env.MONGO_DB_URL);
}

module.exports = { connectToDB };