const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userScheme = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 20,
		},
		lastName: {
			type: String,
		},
		emailId: {
			type: String,
			required: true,
			unique: true,
			validate(value) {
				if (!validator.isEmail(value))
					throw new Error("Invalid Email Address " + value);
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isStrongPassword(value))
					throw new Error("Password is not strong enough");
			},
		},
		age: {
			type: Number,
			min: 18,
			max: 99,
		},
		gender: {
			type: String,
			enum: {
				values: ["male", "female", "others"],
				message: "{VALUE} is not a valid gender",
			},
		},
		photoUrl: {
			type: String,
			validate(value) {
				if (!validator.isURL(value))
					throw new Error("Invalid URL for profile : " + value);
			},
			default:
				"https://media.newyorker.com/photos/66ba72ad48c45ec2854f7f13/3:2/w_2559,h_1706,c_limit/Anderson-Musk-PoliticalActivism.jpg",
		},
		about: {
			type: String,
			default: "This is a default about of the user",
		},
		skills: {
			type: [String],
		},
		badges: {
			type: [String],
			default: [],
		},
		integrityStatus: {
			type: String,
			enum: {
				values: ["clean", "violated"],
				message: "{VALUE} is not a valid integrity status",
			},
			default: "clean",
		},
		violationReports: {
			type: [
				{
					reportId: {
						type: mongoose.Schema.Types.ObjectId,
					},
					description: {
						type: String,
						maxlength: 500,
					},
					resolved: {
						type: Boolean,
						default: false,
					},
				},
			],
			default: [],
		},
		events: {
			type: [
				{
					eventId: {
						type: mongoose.Schema.Types.ObjectId,
					},
					title: {
						type: String,
					},
					status: {
						type: String,
						enum: ["upcoming", "attended", "missed"],
					},
				},
			],
			default: [],
		},
		groups: {
			type: [
				{
					groupId: {
						type: mongoose.Schema.Types.ObjectId,
					},
					name: {
						type: String,
					},
				},
			],
			default: [],
		},
		projects: {
			type: [
				{
					projectId: {
						type: mongoose.Schema.Types.ObjectId,
					},
					title: {
						type: String,
					},
					description: {
						type: String,
					},
					technologies: {
						type: [String],
					},
				},
			],
			default: [],
		},
	},
	{ timestamps: true }
);

userScheme.methods.getJWT = async function () {
	const user = this;
	const token = await jwt.sign({ _id: user._id }, "DEVLORDKING", {
		expiresIn: "1d",
	});
	return token;
};

userScheme.methods.validatePassword = async function (password) {
	const user = this;
	const PasswordHash = user.password;
	const isPasswordValid = await bcrypt.compare(password, PasswordHash);
	return isPasswordValid;
};

const User = mongoose.model("User", userScheme);
module.exports = { User };
