const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/user");
const ConnectionRequest = require("../models/ConnectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/requests/received", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const Connections = await ConnectionRequest.find({
			toUserId: loggedInUser._id,
			status: "interested",
		}).populate("fromUserId", [
			"firstName",
			"lastName",
			"photoUrl",
			"about",
			"skills",
		]);
		res.status(200).json({ message: "Data Send Successfully", Connections });
	} catch (err) {
		res.status(400).send("Something went wrong");
	}
});

userRouter.get("/connections", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connections = await ConnectionRequest.find({
			$or: [
				{ fromUserId: loggedInUser._id, status: "accepted" },
				{ toUserId: loggedInUser._id, status: "accepted" },
			],
		})
			.populate("fromUserId", USER_SAFE_DATA)
			.populate("toUserId", USER_SAFE_DATA);
		const data = connections.map((row) => {
			if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
				return row.toUserId;
			}
			return row.fromUserId;
		});
		res.status(200).json({ message: "Data Send Successfully", data });
	} catch (err) {
		res.status(400).send({ message: err.message });
	}
});

userRouter.get("/feed", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;

		limit = limit > 50 ? limit : 50;

		const skip = (page - 1) * limit;

		const connections = await ConnectionRequest.find({
			$or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
		}).select("fromUserId toUserId");

		const hideUsersFromFeed = new Set();
		connections.forEach((user) => {
			hideUsersFromFeed.add(user.fromUserId.toString());
			hideUsersFromFeed.add(user.toUserId.toString());
		});
		const users = await User.find({
			$and: [
				{ _id: { $nin: Array.from(hideUsersFromFeed) } },
				{ _id: { $ne: loggedInUser._id } },
			],
		})
			.select(USER_SAFE_DATA)
			.skip(skip)
			.limit(limit);
		res.status(200).send(users);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

module.exports = userRouter;
