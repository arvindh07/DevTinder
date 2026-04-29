const express = require("express");
const { stateConstants } = require("../utils/constants");
const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user.model");

const requestRouter = express.Router();

// right swipe
requestRouter.post("/send/:status/:userId", async (req, res, next) => {
    try {
        const status = req.params?.status;
        const toUserId = req.params?.userId;
        const fromUserId = req.user?._id;

        const findToUser = await User.findById(toUserId);
        if (!findToUser) {
            return res.status(400).json({
                message: "Invalid to user id"
            })
        }
        // check is already interested or ignored
        const existingConnections = await ConnectionRequest.findOne({
            $or: [
                {
                    toUserId,
                    fromUserId
                },
                {
                    toUserId: fromUserId,
                    fromUserId: toUserId
                }
            ]
        });

        if (toUserId === fromUserId.toString()) {
            return res.status(400).json({
                message: "Invalid request: Both cannot be same person"
            })
        }

        if (existingConnections) {
            return res.status(400).json({
                message: "There is already a connection present"
            })
        }

        const allowedStatus = [stateConstants.INTERESTED, stateConstants.IGNORED];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type: " + status
            })
        }
        const newConnectionRequest = await ConnectionRequest.create({
            fromUserId,
            toUserId,
            status
        });

        return res.status(201).json({
            message: "Connection request sent successfully",
            data: newConnectionRequest
        })
    } catch (error) {
        console.log(`Failed to send connection request `, error.message);
        return res.status(400).json({
            message: error.message || "Failed to send connection request"
        })
    }
})

// left swipe
requestRouter.post("/send/ignored/:userId", (req, res, next) => {
    try {
        // create a request
        const toUserId = req.params?.userId;
        const fromUserId = req.user?._id;

        const status = stateConstants.IGNORED;

        const newConnectionRequest = new ConnectionRequest.create({
            fromUserId,
            toUserId,
            status
        });

        return res.status(201).json({
            message: "Connection request created successfully",
            data: newConnectionRequest
        })
    } catch (error) {
        console.log(`Failed to send connection request `, error.message);
        return res.status(400).json({
            message: error.message || "Failed to send connection request"
        })
    }
})

module.exports = {
    requestRouter
}