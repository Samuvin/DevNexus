const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async (req, res, next) => {
	try {
		const { token } = req.cookies;
		if (!token) {
			return res.status(401).send("Please Login You are Unauthorized");
		}
		const decodedMessage = jwt.verify(
			token,
			process.env.JWT_SECRET || "DEVLORDKING"
		);
		const { _id } = decodedMessage;

		const user = await User.findById(_id);
		if (!user) {
			throw new Error("User not found");
		}

		req.user = user;
		next();
	} catch (err) {
		res.status(401).send("Authentication Failed: " + err.message); // Updated status code and message
	}
};

module.exports = { userAuth };
