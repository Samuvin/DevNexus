const express = require("express");
const { DBconnect } = require("./config/database");
const cookieParser = require("cookie-parser");

require("dotenv").config();
DBconnect();
const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/request");
const userRouter = require("./Routes/user");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

app.listen(process.env.PORT, () => {
	console.log("listening on", process.env.PORT);
});
