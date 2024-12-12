const express = require("express");
const { DBconnect } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const path = require("path");
require("dotenv").config();
DBconnect();
const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/request");
const userRouter = require("./Routes/user");
const reportRouter = require("./Routes/report");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/report", reportRouter);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(
		path.resolve(__dirname, "..", "..", "frontend", "dist", "index.html")
	);
});

app.listen(process.env.PORT, () => {
	console.log("listening on", process.env.PORT);
});
