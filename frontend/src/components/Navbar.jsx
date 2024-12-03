import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
	const user = useSelector((store) => store.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleLogout = async () => {
		try {
			const res = await axios.post(
				BASE_URL + "/auth/logout",
				{},
				{ withCredentials: true }
			);
			dispatch(removeUser());
			navigate("/login");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="navbar bg-base-200">
			<div className="flex-1">
				<Link to="/" className="btn btn-ghost text-xl">
					DevNexus
				</Link>
			</div>
			{user && (
				<div className="flex-none gap-2">
					<div className="form-control">Welcome, {user.firstName}</div>
					<div className="dropdown dropdown-end mx-5">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost btn-circle avatar">
							<div className="w-10 rounded-full">
								<img
									alt="Tailwind CSS Navbar component"
									src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
								/>
							</div>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
							<li>
								<Link to="/profile" className="justify-between">
									Profile
									<span className="badge">New</span>
								</Link>
							</li>
							<li>
								<Link to="/connections">Connections</Link>
							</li>
							<li>
								<Link to="/requests">Requests</Link>
							</li>
							<li>
								<a onClick={handleLogout}>Logout</a>
							</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

export default Navbar;