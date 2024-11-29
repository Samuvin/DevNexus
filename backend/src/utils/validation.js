const validator = require("validator");
const validateSignUpData = (req) => {
	const { firstName, lastName, emailId, password } = req.body;
	if (!firstName || !lastName || !emailId || !password)
		throw new Error("Complete the registration Properly");
	if (firstName.length < 4 || firstName.length >= 50) {
		throw new Error("First Name should be between 4 and 50 characters");
	} else if (!validator.isEmail(emailId)) {
		throw new Error("Invalid Email");
	} else if (!validator.isStrongPassword(password)) {
		throw new Error("Password is not strong enough");
	}
};

module.exports = { validateSignUpData };
