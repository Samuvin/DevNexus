import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import Card from "./Card";
const Feed = () => {
	const feed = useSelector((store) => store.feed);
	console.log(feed);
	const dispatch = useDispatch();

	const getFeed = async () => {
		if (feed) return;
		try {
			const res = await axios.get(BASE_URL + "/user/feed", {
				withCredentials: true,
			});
			console.log(res.data);
			dispatch(addFeed(res?.data?.data));
		} catch (err) {
			console.log(err.message);
		}
	};
	useEffect(() => {
		getFeed();
	}, []);
	return (
		<>
			{feed && (
				<div className="flex justify-center my-10">
					<Card user={feed[0]} />
				</div>
			)}
		</>
	);
};

export default Feed;
