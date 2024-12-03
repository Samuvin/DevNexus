import { RxAvatar } from "react-icons/rx";
const Card = ({ user }) => {
	console.log(user);
	const { firstName, lastName, photoUrl, gender, age, about } = user;
	return (
		<>
			<div className="card bg-base-300 w-96 shadow-xl">
				<figure>
					{photoUrl && <img src={user.photoUrl} alt="photo" />}
					{!photoUrl && <RxAvatar size={250} />}
				</figure>
				<div className="card-body">
					<h2 className="card-title">
						{firstName + " " + lastName}
						<div className="badge badge-secondary">NEW</div>
					</h2>
					<p>{age + " , " + gender}</p>
					<p>{about}</p>

					<div className="card-actions justify-center my-5 ">
						<button className="btn btn-primary">Ignore</button>
						<button className="btn btn-secondary">Interested</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Card;
