import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
	const [emailId, setEmailId] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [isLoginForm, setIsLoginForm] = useState(true);
	const [error, setError] = useState("");
	const [showToast, setShowToast] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				BASE_URL + "/auth/login",
				{ emailId, password },
				{ withCredentials: true }
			);
			dispatch(addUser(res.data));
			navigate("/");
		} catch (err) {
			setError(err?.response?.data?.data || "Something went wrong");
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);
		}
	};

	const handleSignUp = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				BASE_URL + "/auth/signup",
				{ firstName, lastName, emailId, password },
				{ withCredentials: true }
			);
			dispatch(addUser(res.data.data));
			navigate("/profile");
		} catch (err) {
			setError(err?.response?.data?.data || "Something went wrong");
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);
		}
	};

	return (
		<div className="hero bg-gradient-to-b from-gray-950 to-gray-800 text-base-content h-screen flex items-center justify-center mb-10">
			{showToast && (
				<div className="toast toast-top toast-center z-50">
					<div className="alert alert-error shadow-lg">
						<span>{error}</span>
					</div>
				</div>
			)}
			<div className="hero-content flex-col lg:flex-row-reverse gap-8">
				<div className="text-center lg:text-left max-w-lg">
					<h1 className="text-4xl font-extrabold text-primary">
						{isLoginForm ? "Welcome Back!" : "Create an Account!"}
					</h1>
					<p className="py-6 text-base-content">
						{isLoginForm
							? "Access your account by entering your email and password."
							: "Join us and start your journey today!"}
					</p>
				</div>
				<div className="card w-full max-w-md bg-base-100 shadow-2xl rounded-3xl border border-gray-700">
					<div className="relative -top-5 p-4 bg-primary rounded-full shadow-md text-center">
						<span className="text-white font-bold text-sm">
							{isLoginForm ? "Login" : "Sign Up"}
						</span>
					</div>
					<form
						className="card-body space-y-4"
						onSubmit={isLoginForm ? handleLogin : handleSignUp}>
						{!isLoginForm && (
							<>
								<div className="form-control">
									<label className="label">
										<span className="label-text">First Name</span>
									</label>
									<input
										type="text"
										placeholder="First Name"
										className="input input-bordered focus:outline-primary"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										required
									/>
								</div>
								<div className="form-control">
									<label className="label">
										<span className="label-text">Last Name</span>
									</label>
									<input
										type="text"
										placeholder="Last Name"
										className="input input-bordered focus:outline-primary"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										required
									/>
								</div>
							</>
						)}
						<div className="form-control">
							<label className="label">
								<span className="label-text">Email</span>
							</label>
							<input
								type="email"
								placeholder="Email"
								className="input input-bordered focus:outline-primary"
								value={emailId}
								onChange={(e) => setEmailId(e.target.value)}
								required
							/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">Password</span>
							</label>
							<input
								type="password"
								placeholder="Password"
								className="input input-bordered focus:outline-primary"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className="form-control mt-6">
							<button
								className="btn btn-primary w-full rounded-lg shadow-lg"
								type="submit">
								{isLoginForm ? "Login" : "Sign Up"}
							</button>
						</div>
					</form>
					<p
						className="text-center mt-4 text-secondary cursor-pointer my-5"
						onClick={() => setIsLoginForm(!isLoginForm)}>
						{isLoginForm
							? "New User? Sign up here"
							: "Existing User? Login here"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
