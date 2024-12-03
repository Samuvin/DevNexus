/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
	content: ["./public/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {}, // Leave space for custom theme extensions if needed
	},
	plugins: [daisyui],
	daisyui: {
		themes: ["night"],
	},
};
