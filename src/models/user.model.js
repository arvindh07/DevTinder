import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    gender: String,
    age: Number,
    password: {
        type: String,
        required: true
    },
    profilePicture: String
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;