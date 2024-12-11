import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
	const connections = useSelector((store) => store.connections);
	const dispatch = useDispatch();

	const [reportModalIsOpen, setReportModalIsOpen] = useState(false); // State for report modal
	const [userModalIsOpen, setUserModalIsOpen] = useState(false); // State for user data modal
	const [reportData, setReportData] = useState({
		reportedUser: "",
		description: "",
		violationType: "cheating",
	});
	const [toastIsVisible, setToastIsVisible] = useState(false); // State to control toast visibility
	const [userData, setUserData] = useState(null); // State to hold user data for modal

	const fetchConnections = async () => {
		try {
			const res = await axios.get(BASE_URL + "/user/connections", {
				withCredentials: true,
			});
			dispatch(addConnection(res.data.data));
		} catch (err) {
			console.error("Error fetching connections:", err);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setReportData({ ...reportData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				BASE_URL + "/report/reportUser",
				reportData,
				{
					withCredentials: true,
				}
			);
			console.log("Report submitted:", res.data);
			setReportModalIsOpen(false); // Close the report modal
			setToastIsVisible(true); // Show toast after successful report submission
			setTimeout(() => setToastIsVisible(false), 3000); // Hide toast after 3 seconds
		} catch (err) {
			console.error("Error submitting report:", err);
		}
	};

	const openReportModal = (userId) => {
		setReportData({ ...reportData, reportedUser: userId });
		setReportModalIsOpen(true); // Open the report modal
	};

	const openUserDataModal = (userId) => {
		// Find the user in connections and set it in the state
		const selectedUser = connections.find((user) => user._id === userId);
		setUserData(selectedUser);
		setUserModalIsOpen(true); // Open the user data modal
	};

	const closeModal = () => {
		setReportModalIsOpen(false); // Close report modal
		setUserModalIsOpen(false); // Close user data modal
		setUserData(null); // Reset user data when closing the modal
	};

	useEffect(() => {
		fetchConnections();
	}, []);

	if (!connections) return null;

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
						className="flex items-center p-6 m-4 rounded-lg shadow-lg bg-neutral-focus border border-neutral-content hover:bg-neutral hover:shadow-xl transition-all max-w-3xl mx-auto">
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

							<button
								onClick={() => openUserDataModal(_id)}
								className="btn btn-outline btn-sm btn-primary mt-4 px-4 py-2">
								View User Data
							</button>

							<button
								onClick={() => openReportModal(_id)}
								className="btn btn-outline btn-sm btn-error mt-4 ml-4 px-4 py-2">
								Report
							</button>
						</div>
					</div>
				);
			})}

			<div
				className={`modal ${userModalIsOpen ? "modal-open" : ""}`}
				onClick={closeModal}>
				<div
					className="modal-box"
					onClick={(e) => e.stopPropagation()} // Prevent closing modal on form click
				>
					<h2 className="text-xl font-semibold mb-4">User Data</h2>
					{userData && (
						<div>
							{/* Name */}
							<p className="text-lg font-semibold">
								Name:{" "}
								{userData.firstName ? userData.firstName : "Data not provided"}{" "}
								{userData.lastName ? userData.lastName : "Data not provided"}
							</p>

							{/* Age */}
							<p>Age: {userData.age ? userData.age : "Data not provided"}</p>

							{/* Gender */}
							<p>
								Gender:{" "}
								{userData.gender ? userData.gender : "Data not provided"}
							</p>

							{/* About */}
							<p>
								About: {userData.about ? userData.about : "Data not provided"}
							</p>

							{/* Skills */}
							<p>
								Skills:{" "}
								{userData.skills && userData.skills.length > 0
									? userData.skills.join(", ")
									: "Data not provided"}
							</p>

							{/* Photo */}
							<div className="flex justify-center my-4">
								<img
									src={
										userData.photoUrl ? userData.photoUrl : "default-photo-url"
									} // Use a default image if no photo URL
									alt="User Avatar"
									className="w-32 h-32 rounded-full object-cover border-2 border-neutral-400"
								/>
							</div>

							{/* Badges */}
							<p>
								Badges:{" "}
								{userData.badges && userData.badges.length > 0
									? userData.badges.join(", ")
									: "Data not provided"}
							</p>

							{/* Integrity Status */}
							<p>
								Integrity Status:{" "}
								{userData.integrityStatus
									? userData.integrityStatus
									: "Data not provided"}
							</p>

							{/* Violation Reports */}
							<div>
								<h3 className="mt-4 text-lg font-semibold">
									Violation Reports:
								</h3>
								<ul>
									{userData.violationReports &&
									userData.violationReports.length > 0
										? userData.violationReports.map((report, index) => (
												<li key={index}>
													{report.description} -{" "}
													{report.resolved ? "Resolved" : "Pending"}
												</li>
										  ))
										: "Data not provided"}
								</ul>
							</div>

							{/* Events */}
							<div>
								<h3 className="mt-4 text-lg font-semibold">Events:</h3>
								<ul>
									{userData.events && userData.events.length > 0
										? userData.events.map((event, index) => (
												<li key={index}>
													{event.title} - {event.status}
												</li>
										  ))
										: "Data not provided"}
								</ul>
							</div>

							{/* Groups */}
							<div>
								<h3 className="mt-4 text-lg font-semibold">Groups:</h3>
								<ul>
									{userData.groups && userData.groups.length > 0
										? userData.groups.map((group, index) => (
												<li key={index}>{group.name}</li>
										  ))
										: "Data not provided"}
								</ul>
							</div>

							{/* Projects */}
							<div>
								<h3 className="mt-4 text-lg font-semibold">Projects:</h3>
								<ul>
									{userData.projects && userData.projects.length > 0
										? userData.projects.map((project, index) => (
												<li key={index}>
													<strong>{project.title}</strong> -{" "}
													{project.description}
													<p>Technologies: {project.technologies.join(", ")}</p>
												</li>
										  ))
										: "Data not provided"}
								</ul>
							</div>
						</div>
					)}

					<div className="modal-action">
						<button
							onClick={closeModal}
							className="btn btn-outline btn-sm btn-error">
							Close
						</button>
					</div>
				</div>
			</div>

			<div
				className={`modal ${reportModalIsOpen ? "modal-open" : ""}`}
				onClick={closeModal}>
				<div
					className="modal-box"
					onClick={(e) => e.stopPropagation()} // Prevent closing modal on form click
				>
					<h2 className="text-xl font-semibold mb-4">Submit a Report</h2>
					<form onSubmit={handleSubmit}>
						<div>
							<label className="block text-sm mb-2" htmlFor="violationType">
								Violation Type:
							</label>
							<select
								id="violationType"
								name="violationType"
								value={reportData.violationType}
								onChange={handleInputChange}
								className="w-full p-2 mb-4 border border-neutral-400 rounded">
								<option value="cheating">Cheating</option>
								<option value="abuse">Abuse</option>
								<option value="harassment">Harassment</option>
								<option value="spam">Spam</option>
								<option value="other">Other</option>
							</select>
						</div>

						<div>
							<label className="block text-sm mb-2" htmlFor="description">
								Description:
							</label>
							<textarea
								id="description"
								name="description"
								value={reportData.description}
								onChange={handleInputChange}
								maxLength="500"
								rows="4"
								className="w-full p-2 mb-4 border border-neutral-400 rounded"
							/>
						</div>

						<button
							type="submit"
							className="px-6 py-2 bg-blue-600 text-white rounded">
							Submit Report
						</button>
					</form>
					<div className="modal-action">
						<button
							onClick={closeModal}
							className="btn btn-outline btn-sm btn-error">
							Close
						</button>
					</div>
				</div>
			</div>

			{/* Toast Notification */}
			{toastIsVisible && (
				<div className="toast toast-top toast-center">
					<div className="alert alert-success">
						<div>
							<span>Report Submitted Successfully!</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Connections;
