const express = require("express");
const Router = express.Router();
const Report = require("../models/reportScheme");
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/user");

Router.post("/reportUser", userAuth, async (req, res) => {
	try {
		const { reportedUser, description, violationType } = req.body;
		const reporter = req.user;
		if (!reportedUser || !description || !violationType || !reporter) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const validViolationTypes = [
			"cheating",
			"abuse",
			"harassment",
			"spam",
			"other",
		];
		if (!validViolationTypes.includes(violationType)) {
			return res.status(400).json({ error: "Invalid violation type" });
		}

		const user = await User.findById(reportedUser);

		if (!user) {
			return res.status(400).json({ error: "Reported user does not exist" });
		}

		const reporterUser = await User.findById(reporter);
		if (!reporterUser) {
			return res.status(400).json({ error: "Reporter user does not exist" });
		}

		const report = new Report({
			reportedUser,
			description,
			violationType,
			reporter,
		});

		user.violationReports.push(report._id);
		await report.save();
		await user.save();
		res.status(201).json({
			message: "Report created successfully",
			data: report,
		});
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ status: "failed", message: "Internal Server Error" });
	}
});

Router.get("/reportData/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const reports = await User.findById(id).populate("violationReports");

		res
			.status(200)
			.json({ message: "success", data: reports.violationReports });
	} catch (err) {
		res.status(400).send({ message: err.message });
	}
});

module.exports = Router;
