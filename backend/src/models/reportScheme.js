const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
	{
		reportedUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		description: {
			type: String,
			required: true,
			maxlength: 500,
		},
		violationType: {
			type: String,
			enum: ["cheating", "abuse", "harassment", "spam", "other"],
			required: true,
		},
		reporter: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
