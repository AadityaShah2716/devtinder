const express = require('express');
const { userAuth } = require('../../middleware/auth')
const connectionRequestSchema = require('../models/ConnectionRequest');
const requestRouter = express.Router();
const user = require('../models/user');
const ConnectionRequest = require('../models/ConnectionRequest');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {

        const fromUserId = req.user._id;
        const toUserId = req?.params?.toUserId;
        const status = req?.params?.status
        const allowedStatus = ["Ignored", "Interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send('Status is not valid');
        }
        const existingConnectionRequest = await connectionRequestSchema.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]

        });

        if (existingConnectionRequest) {
            return res.status(400).send('Connection request already exists');
        }

        const newConnectionIdexist = await user.findById(toUserId);
        // if (newConnectionIdexist) {
        //     if (fromUserId?.toString() === toUserId) {
        //         return res.status(400).send('Cannot send request to yourself');

        //     }
        // }
        if (!newConnectionIdexist) {
            return res.status(404).json({ message: "User Not Found" });
        }
        const ConnectionRequest = new connectionRequestSchema({
            fromUserId,
            toUserId,
            status
        })
        const data = await ConnectionRequest.save();
        res.json({
            message: req.user.firstName + " is " + status + " in " + newConnectionIdexist.firstName,
            data
        })


    } catch (error) {
        res.status(400).send("ERROR:" + error?.message)
    }

})

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInuser = req?.user;
        const { status, requestId } = req?.params;
        const allowedStatus = ['Accepted', 'Rejected'];
        if (!allowedStatus.includes(status)) {


            return res.status(400).send('Status is not valid');
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInuser?._id,
            status: 'Interested',

        })
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        return res.json({ message: "Connection Request" + status, data })
    } catch (error) {
        res.status(400).send("ERROR:" + error?.message);
    }
})

module.exports = requestRouter