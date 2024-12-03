import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
	name: "feed",
	initialState: null,
	reducers: {
		addFeed: (state, actions) => actions.payload,
		removeFeed: (state, action) => null,
	},
});

export const { addFeed } = feedSlice.actions;
export default feedSlice.reducer;
