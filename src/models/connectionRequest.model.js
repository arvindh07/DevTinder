const { Schema, default: mongoose } = require("mongoose");
const { states } = require("../utils/constants");

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: states,
            message: `{VALUE} is not supported`
        },
        required: true
    }
}, {
    timestamps: true
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;