import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
	const requests = useSelector((store) => store.requests);
	const dispatch = useDispatch();

	const reviewRequest = async (status, _id) => {
		try {
			await axios.post(
				`${BASE_URL}/request/review/${status}/${_id}`,
				{},
				{ withCredentials: true }
			);
			dispatch(removeRequest(_id));
		} catch (err) {
			console.error(err);
		}
	};

	const fetchRequests = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/user/requests/received`, {
				withCredentials: true,
			});
			dispatch(addRequest(res.data.Connections));
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchRequests();
	}, []);

	if (!requests) return null;

	if (requests.length === 0)
		return (
			<h1 className="text-3xl font-bold text-center mt-40 text-white mb-6">
				No Requests Found
			</h1>
		);

	return (
		<div className="text-center my-10">
			<h1 className="text-3xl font-bold text-white mb-6">
				Connection Requests
			</h1>

			{requests.map((request) => {
				const { _id, firstName, lastName, photoUrl, age, gender, about } =
					request.fromUserId;

				return (
					<div
						key={_id}
						className="flex items-center justify-between p-6 m-4 rounded-lg shadow-lg bg-neutral-focus border border-neutral-content hover:bg-neutral hover:shadow-xl transition-all max-w-3xl mx-auto">
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
						<div className="flex space-x-4">
							<button
								className="btn btn-error btn-outline hover:bg-error hover:text-white"
								onClick={() => reviewRequest("rejected", request._id)}>
								Reject
							</button>
							<button
								className="btn btn-success btn-outline hover:bg-success hover:text-white"
								onClick={() => reviewRequest("accepted", request._id)}>
								Accept
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Requests;
