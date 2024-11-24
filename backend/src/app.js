const express = require("express");
require("dotenv").config();
const app = express();

//Request handlers
//First paramter route
app.use((req, res) => {
	res.send("Hello From the server");
});
app.listen(process.env.PORT, () => {
	console.log("listening on", process.env.PORT);
});
