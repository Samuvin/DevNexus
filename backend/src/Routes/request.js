const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const { User } = require("../models/user");
const { connection } = require("mongoose");
const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
	try {
		const fromUserId = req.user._id;
		const toUserId = req.params.toUserId;
		const status = req.params.status;

		const allowedStatus = ["ignored", "interested"];
		if (!allowedStatus.includes(status)) {
			return res.status(400).json({
				message: "Invalid status Type",
				Error: status,
			});
		}

		//If there is an existing connection request
		const existingConnectionRequest = await ConnectionRequest.findOne({
			$or: [
				{ fromUserId, toUserId },
				{ fromUserId: toUserId, toUserId: fromUserId },
			],
		});

		if (existingConnectionRequest) {
			return res.status(400).json({
				message: "A connection request already exists between these users",
			});
		}

		const toUser = await User.findById(toUserId);
		if (!toUser) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		const Connection = new ConnectionRequest({
			fromUserId,
			toUserId,
			status,
		});
		const data = await Connection.save();
		res.json({
			message:
				req.user.firstName + " " + "is " + status + " " + toUser.firstName,
			data,
		});
	} catch (err) {
		res.status(400).send(`Unauthorized request ${err.message}`);
	}
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const { status, requestId } = req.params;

		const allowedStatus = ["accepted", "rejected"];
		if (!allowedStatus.includes(status)) {
			return res.status(400).json({ messaage: "Status not allowed!" });
		}

		const connectionRequest = await ConnectionRequest.findOne({
			_id: requestId,
			toUserId: loggedInUser._id,
			status: "interested",
		});
		console.log(connectionRequest);
		if (!connectionRequest) {
			return res.status(404).json({ message: "Connection request not found" });
		}

		connectionRequest.status = status;

		const data = await connectionRequest.save();

		res.json({ message: "Connection request " + status, data });
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

module.exports = requestRouter;
