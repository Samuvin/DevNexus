import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
const Body = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userData = useSelector((store) => store.user);
	const fetchUser = async () => {
		try {
			const user = await axios.get(BASE_URL + "/profile/view", {
				withCredentials: true,
			});
			console.log(user.data);
			dispatch(addUser(user.data));
		} catch (err) {
			if (err.code === 401) {
				navigate("/login");
			}
			console.log("Error Found in Finding User " + err.message);
		}
	};
	useEffect(() => {
		if (!userData) {
			fetchUser();
		}
	}, []);
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
};

export default Body;