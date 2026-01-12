const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../../middleware/auth');
const ConnectionRequest = require('../models/ConnectionRequest');
const user = require('../models/user');
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"
userRouter.get('/user/requests', userAuth, async (req, res) => {
    try {
        const loggedInUser = req?.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser?._id,
            status: 'Interested'
        }).populate("fromUserId", ["firstName", "lastName"])
        res.json({ message: "Data fetch successfully", data: connectionRequests })
    } catch (error) {
        req.statusCode(400).send("ERROR" + error?.message)
    }
})
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req?.user;
        const findConnections = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: loggedInUser?._id,
                    status: 'Accepted'
                },
                {
                    fromUserId: loggedInUser?._id,
                    status: 'Accepted'
                }

            ],

        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        const result = findConnections.map((row) => {
            if (row?.fromUserId._id.toString() === loggedInUser?._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({ result })

    } catch (error) {
        res.status(400).send("ERROR" + error?.message)

    }

})
userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req?.user;
        const skip = parseInt(req?.query?.skip) || 1;
        let limit = parseInt(req?.params?.limit) || 10;
        limit = limit > 50 ? limit : 10;
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser?._id }, { toUserId: loggedInUser?._id }]
        }).select(USER_SAFE_DATA);
        const hideUsersFromFeed = new Set();
        connectionRequests?.forEach(req => {
            hideUsersFromFeed?.add(req?.fromUserId?.toString());
            hideUsersFromFeed.add(req?.toUserId?.toString());
        })
        const users = await user.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser?._id } }
            ]
        }).skip(skip).limit(limit)
        res.send(users);
    } catch (error) {
        res.status(400).json({ message: error?.message })
    }
})


module.exports = userRouter;