import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
	const connections = useSelector((store) => store.connections);
	const dispatch = useDispatch();
	const fetchConnections = async () => {
		try {
			const res = await axios.get(BASE_URL + "/user/connections", {
				withCredentials: true,
			});
			dispatch(addConnection(res.data.data));
		} catch (err) {}
	};
	useEffect(() => {
		fetchConnections();
	}, []);
	if (!connections) return;
	if (connections.length === 0) return <h1>No Connections Found</h1>;
	return (
		<div className="text-center my-10">
			<h1 className="text-bold text-black text-3xl">Connections</h1>

			{connections.map((connection) => {
				const { _id, firstName, lastName, photoUrl, age, gender, about } =
					connection;

				return (
					<div
						key={_id}
						className=" flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto">
						<div>
							<div className="avatar">
								<div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
									<img
										alt="photo"
										className="w-20 h-20 rounded-full object-cover"
										src={photoUrl}
									/>
								</div>
							</div>
						</div>
						<div className="text-left mx-4 ">
							<h2 className="font-bold text-xl">
								{firstName + " " + lastName}
							</h2>
							{age && gender && <p>{age + ", " + gender}</p>}
							<p>{about}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Connections;