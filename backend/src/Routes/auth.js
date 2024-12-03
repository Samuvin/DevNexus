const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();
authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body;
		const user = await User.findOne({ emailId: emailId });
		if (!user) {
			throw new Error("User not found");
		}
		const isPasswordValid = await user.validatePassword(password);
		if (isPasswordValid) {
			const token = await user.getJWT();
			res.cookie("token", token, {
				expires: new Date(Date.now() + 8 * 900000),
			});
			res.send(user);
		} else throw new Error("Login Failed");
	} catch (err) {
		res.status(400).send({
			status: "failed",
			data: "User login failed " + err.message,
		});
	}
});

authRouter.post("/logout", async (req, res) => {
	try {
		res.cookie("token", null, {
			expires: new Date(Date.now()),
		});
		res.status(200).send("Logout Successfull");
	} catch (err) {
		res.status(400).send("Error in Log Out");
	}
});

module.exports = authRouter;
