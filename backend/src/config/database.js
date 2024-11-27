const mongoose = require("mongoose");

const DBconnect = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://admin:admin123@techtribe.kxbxw.mongodb.net/?retryWrites=true&w=majority&appName=TechTribe"
		);
		console.log("Connected to MongoDB Atlas");
	} catch (err) {
		console.log("Connection to MongoDB Atlas Failed => " + err);
	}
};

module.exports = { DBconnect };
