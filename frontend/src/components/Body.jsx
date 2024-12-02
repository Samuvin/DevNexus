import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
const Body = () => {
	return (
		<>
			<Navbar />
			<Outlet />
			{/* <Footer /> */}
		</>
	);
};

export default Body;
