import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
const Login = () => {
	const [emailId, setEmailId] = useState("admin@gmail.com");
	const [password, setPassword] = useState("Admin@123");
	const [error, setError] = useState("");
	const [showToast, setShowToast] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
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
			setError(err?.response?.data?.data || "Something Went Wrong");
			setShowToast(true);
			setTimeout(() => {
				setShowToast(false);
			}, 2000);
		}
	};
	return (
		<div className="hero bg-base-200 min-h-screen">
			{showToast && (
				<div className="toast toast-top toast-center">
					<div className="alert alert-info">
						<span>{error}</span>
					</div>
				</div>
			)}
			<div className="hero-content flex-col lg:flex-row-reverse">
				<div className="text-center lg:text-left">
					<h1 className="text-5xl font-bold">Login now!</h1>
					<p className="py-6">
						Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
						excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
						a id nisi.
					</p>
				</div>
				<div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
					<form className="card-body">
						<div className="form-control">
							<label className="label">
								<span className="label-text">Email</span>
							</label>
							<input
								type="email"
								placeholder="email"
								className="input input-bordered"
								required
								value={emailId}
								onChange={(e) => setEmailId(e.target.value)}
							/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">Password</span>
							</label>
							<input
								type="password"
								placeholder="password"
								className="input input-bordered"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<label className="label">
								<a href="#" className="label-text-alt link link-hover">
									Forgot password?
								</a>
							</label>
						</div>
						<div className="form-control mt-6">
							<button className="btn btn-primary" onClick={handleLogin}>
								Login
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
