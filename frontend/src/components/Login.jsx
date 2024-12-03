// import { useState } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { addUser } from "../utils/userSlice";
// import { useNavigate } from "react-router-dom";
// import { BASE_URL } from "../utils/constants";
// const Login = () => {
// 	const [emailId, setEmailId] = useState("admin@gmail.com");
// 	const [password, setPassword] = useState("Admin@123");
// 	const [error, setError] = useState("");
// 	const [showToast, setShowToast] = useState(false);
// 	const dispatch = useDispatch();
// 	const navigate = useNavigate();

// 	const handleLogin = async (e) => {
// 		e.preventDefault();
// 		try {
// 			const res = await axios.post(
// 				BASE_URL + "/auth/login",
// 				{
// 					emailId,
// 					password,
// 				},
// 				{ withCredentials: true }
// 			);
// 			dispatch(addUser(res.data));
// 			return navigate("/");
// 		} catch (err) {
// 			setError(err?.response?.data?.data || "Something Went Wrong");
// 			setShowToast(true);
// 			setTimeout(() => {
// 				setShowToast(false);
// 			}, 2000);
// 		}
// 	};
// 	return (
// 		<div className="hero bg-base-200 min-h-screen">
// 			{showToast && (
// 				<div className="toast toast-top toast-center">
// 					<div className="alert alert-info">
// 						<span>{error}</span>
// 					</div>
// 				</div>
// 			)}
// 			<div className="hero-content flex-col lg:flex-row-reverse">
// 				<div className="text-center lg:text-left">
// 					<h1 className="text-5xl font-bold">Login now!</h1>
// 					<p className="py-6">
// 						Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
// 						excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
// 						a id nisi.
// 					</p>
// 				</div>
// 				<div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
// 					<form className="card-body">
// 						<div className="form-control">
// 							<label className="label">
// 								<span className="label-text">Email</span>
// 							</label>
// 							<input
// 								type="email"
// 								placeholder="email"
// 								className="input input-bordered"
// 								required
// 								value={emailId}
// 								onChange={(e) => setEmailId(e.target.value)}
// 							/>
// 						</div>
// 						<div className="form-control">
// 							<label className="label">
// 								<span className="label-text">Password</span>
// 							</label>
// 							<input
// 								type="password"
// 								placeholder="password"
// 								className="input input-bordered"
// 								value={password}
// 								onChange={(e) => setPassword(e.target.value)}
// 								required
// 							/>
// 							<label className="label">
// 								<a href="#" className="label-text-alt link link-hover">
// 									Forgot password?
// 								</a>
// 							</label>
// 						</div>
// 						<div className="form-control mt-6">
// 							<button className="btn btn-primary" onClick={handleLogin}>
// 								Login
// 							</button>
// 						</div>
// 					</form>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Login;
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
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			const res = await axios.post(
				BASE_URL + "/auth/login",
				{
					emailId,
					password,
				},
				{ withCredentials: true }
			);
			dispatch(addUser(res.data));
			return navigate("/");
		} catch (err) {
			setError(err?.response?.data || "Something went wrong");
		}
	};

	const handleSignUp = async () => {
		try {
			const res = await axios.post(
				BASE_URL + "/auth/signup",
				{ firstName, lastName, emailId, password },
				{ withCredentials: true }
			);
			dispatch(addUser(res.data.data));
			return navigate("/profile");
		} catch (err) {
			setError(err?.response?.data || "Something went wrong");
		}
	};

	return (
		<div className="flex justify-center my-10">
			<div className="card bg-base-300 w-96 shadow-xl">
				<div className="card-body">
					<h2 className="card-title justify-center">
						{isLoginForm ? "Login" : "Sign Up"}
					</h2>
					<div>
						{!isLoginForm && (
							<>
								<label className="form-control w-full max-w-xs my-2">
									<div className="label">
										<span className="label-text">First Name</span>
									</div>
									<input
										type="text"
										value={firstName}
										className="input input-bordered w-full max-w-xs"
										onChange={(e) => setFirstName(e.target.value)}
									/>
								</label>
								<label className="form-control w-full max-w-xs my-2">
									<div className="label">
										<span className="label-text">Last Name</span>
									</div>
									<input
										type="text"
										value={lastName}
										className="input input-bordered w-full max-w-xs"
										onChange={(e) => setLastName(e.target.value)}
									/>
								</label>
							</>
						)}
						<label className="form-control w-full max-w-xs my-2">
							<div className="label">
								<span className="label-text">Email ID:</span>
							</div>
							<input
								type="text"
								value={emailId}
								className="input input-bordered w-full max-w-xs"
								onChange={(e) => setEmailId(e.target.value)}
							/>
						</label>
						<label className="form-control w-full max-w-xs my-2">
							<div className="label">
								<span className="label-text">Password</span>
							</div>
							<input
								type="password"
								value={password}
								className="input input-bordered w-full max-w-xs"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</label>
					</div>
					<p className="text-red-500">{error}</p>
					<div className="card-actions justify-center m-2">
						<button
							className="btn btn-primary"
							onClick={isLoginForm ? handleLogin : handleSignUp}>
							{isLoginForm ? "Login" : "Sign Up"}
						</button>
					</div>

					<p
						className="m-auto cursor-pointer py-2"
						onClick={() => setIsLoginForm((value) => !value)}>
						{isLoginForm
							? "New User? Signup Here"
							: "Existing User? Login Here"}
					</p>
				</div>
			</div>
		</div>
	);
};
export default Login;
