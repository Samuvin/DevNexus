const express = require("express");
const { DBconnect } = require("./config/database");
const { User } = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

DBconnect();

app.post("/signup", async (req, res) => {
	try {
		validateSignUpData(req);
		const { firstName, lastName, emailId, password } = req.body;
		console.log(password);
		const passwordHash = await bcrypt.hash(password, 10);

		const user = new User({
			firstName,
			lastName,
			emailId,
			password: passwordHash,
		});
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

app.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body;
		const user = await User.findOne({ emailId: emailId });
		if (!user) {
			throw new Error("User not found");
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (isPasswordValid) {
			const token = await jwt.sign({ _id: user._id }, "DEVLORDKING", {
				expiresIn: "1d",
			});
			console.log(token);

			res.cookie("token", token, {
				expires: new Date(Date.now() + 8 * 900000),
			});
			res.send("Login Successfull");
		} else throw new Error("Login Failed");
	} catch (err) {
		res.status(400).send({
			status: "failed",
			data: "User login failed " + err.message,
		});
	}
});

app.get("/profile", userAuth, async (req, res) => {
	try {
		const user = req.user;
		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(`Unauthorized request ${err.message}`);
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

app.post("/sendConnectionRequest", userAuth, (req, res) => {
	try {
	} catch (err) {}
});

app.listen(process.env.PORT, () => {
	console.log("listening on", process.env.PORT);
});
