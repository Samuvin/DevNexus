const express = require("express");
const { DBconnect } = require("./config/database");
const { User } = require("./models/user");

require("dotenv").config();

const app = express();

app.use(express.json());

DBconnect();

app.post("/signup", (req, res) => {
	try {
		const user = new User(req.body);
		user.save();
		console.log("User saved");
		res.status(201).send({
			status: "success",
			data: "User created successfully",
		});
	} catch (err) {
		console.log(err);
		res.status(201).send({
			status: "failed",
			data: "User created successfully",
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

app.patch("/user", async (req, res) => {
	const userId = req.body.userId;
	const data = req.body;
	try {
		const user = await User.findByIdAndUpdate({ _id: userId }, data);
		if (!user) {
			res.status(404).send("User Not Found");
		} else res.status(200).send("User Updated Successfully");
	} catch (err) {
		res.status(400).send("Something went wrong");
	}
});

app.listen(process.env.PORT, () => {
	console.log("listening on", process.env.PORT);
});
