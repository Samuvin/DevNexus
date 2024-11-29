const express = require("express");
const { DBconnect } = require("./config/database");
const { User } = require("./models/user");

require("dotenv").config();

const app = express();

app.use(express.json());

DBconnect();

app.post("/signup", async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).send({
			status: "success",
			data: "User created successfully",
		});
	} catch (err) {
		res.status(400).send({
			status: "failed",
			data: "User creation failed " + err.message,
		});
	}
});

app.get("/user", async (req, res) => {
	try {
		const users = await User.find({ emailId: req.body.emailId });
		if (users.length === 0) {
			res.status(404).send("User Not Found");
		} else res.status(200).send(users);
	} catch (err) {
		res.status(400).send("Something went wrong");
	}
});

app.get("/feed", async (req, res) => {
	try {
		const users = await User.find({});
		if (users.length === 0) {
			res.status(404).send("User Not Found");
		} else res.status(200).send(users);
	} catch (err) {
		res.status(400).send("Something went wrong");
	}
});

app.delete("/user", async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.body.userId);
		if (!user) {
			res.status(404).send("User Not Found");
		} else res.status(200).send("User deleted successfully");
	} catch (err) {
		res.status(400).send("Something went wrong");
	}
});

app.patch("/user/:userId", async (req, res) => {
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

app.listen(process.env.PORT, () => {
	console.log("listening on", process.env.PORT);
});
