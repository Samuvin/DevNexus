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
	if (connections.length === 0)
		return (
			<h1 className="text-3xl font-bold text-center mt-40 text-white mb-6">
				No Connections Found
			</h1>
		);
	return (
		<div className="text-center my-10">
			<h1 className="text-3xl font-bold text-white mb-6">Connections</h1>

			{connections.map((connection) => {
				const { _id, firstName, lastName, photoUrl, age, gender, about } =
					connection;

				return (
					<div
						key={_id}
						className="flex items-center  p-6 m-4 rounded-lg shadow-lg bg-neutral-focus border border-neutral-content hover:bg-neutral hover:shadow-xl transition-all max-w-3xl mx-auto">
						<div>
							<img
								alt="User Avatar"
								className="w-20 h-20 rounded-full object-cover"
								src={photoUrl}
							/>
						</div>
						<div className="text-left mx-6">
							<h2 className="text-xl font-semibold text-white">
								{firstName} {lastName}
							</h2>
							{age && gender && (
								<p className="text-sm text-neutral-content">
									{age}, {gender}
								</p>
							)}
							<p className="text-neutral-content text-sm">{about}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Connections;
