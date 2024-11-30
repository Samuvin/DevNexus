const express = require("express");
const userRouter = express.Router();
const { User } = require("../models/user");

userRouter.get("/user", async (req, res) => {
	try {
		const users = await User.find({ emailId: req.body.emailId });
		if (users.length === 0) {
			res.status(404).send("User Not Found");
		} else res.status(200).send(users);
	} catch (err) {
		res.status(400).send("Something went wrong");
	}
});

userRouter.get("/feed", async (req, res) => {
	try {
		const users = await User.find({});
		if (users.length === 0) {
			res.status(404).send("User Not Found");
		} else res.status(200).send(users);
	} catch (err) {
		res.status(400).send("Something went wrong");
	}
});

userRouter.delete("/user", async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.body.userId);
		if (!user) {
			res.status(404).send("User Not Found");
		} else res.status(200).send("User deleted successfully");
	} catch (err) {
		res.status(400).send("Something went wrong");
	}
});

userRouter.patch("/user/:userId", async (req, res) => {
	const userId = req.params?.userId;
	const data = req.body;
	try {
		const ALLOWED_UPDATES = [
			"photoUrl",
			"about",
			"gender",
			"age",
			"skills",
			"emailId",
		];
		const isUpdateAllowed = Object.keys(data).every((k) => {
			return ALLOWED_UPDATES.includes(k);
		});
		if (!isUpdateAllowed) {
			throw new Error("Update Not Allowed");
		}
		if (Array.isArray(data?.skills) && data.skills.length > 10) {
			throw new Error("Skills should not exceed 10");
		}
		const user = await User.findByIdAndUpdate({ _id: userId }, data, {
			returnDocument: "after",
			runValidators: true,
		});
		if (!user) {
			res.status(404).send("User Not Found");
		} else res.status(200).send("User Updated Successfully");
	} catch (err) {
		console.log(err);
		res
			.status(400)
			.send({ status: "Something went wrong", message: err.message });
	}
});

module.exports = userRouter;
