import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					"ex-light": "#8c73b5",
					"light": "#583989",
					"DEFAULT": "#3f2667", // <-- Este é o seu bg-primary ou text-primary
					"dark": "#281645",
					"ex-dark": "#120920",
				},
				secondary: {
					"ex-light": "#ebadca",
					"light": "#e15194",
					"DEFAULT": "#e01f79",
					"dark": "#B91360",
					"ex-dark": "#610530",
				},
				tertiary: {
					"ex-light": "#84e7f5",
					"light": "#1addf9",
					"DEFAULT": "#00c5e2",
					"dark": "#0097ad",
					"ex-dark": "#003e47",
				},
				auxiliary1: {
					"ex-light": "#9dacc3",
					"light": "#5274a7",
					"DEFAULT": "#3d5b8a",
					"dark": "#29436a",
					"ex-dark": "#0b1423",
				},
				auxiliary2: {
					"ex-light": "#d3d4df",
					"light": "#8f94bd",
					"DEFAULT": "#6870b0",
					"dark": "#49539c",
					"ex-dark": "#22295d",
				},
				dark: {
					"ex-light": "#535181",
					"light": "#262447",
					"DEFAULT": "#121125",
					"dark": "#020104",
					"ex-dark": "#000000",
				},
				positive: "#059669",
				negative: "#DC2626",
				neutral: "#4B5563",
			},
			spacing: {
				xxs: "4px",
				xs: "8px",
				s: "16px",
				m: "24px",
				l: "32px",
				xl: "40px",
				xxl: "48px",
				xxxl: "64px",
			},
			borderRadius: {
				xs: "4px",
				s: "8px",
				m: "16px",
				l: "24px",
				xl: "32px",
				xxl: "48px",
				xxxl: "64px",
			},
		},
	},
	safelist: ["bg-primary", "text-primary", "bg-secondary", "text-secondary", "bg-positive", "text-positive", "bg-negative", "text-negative"],
	plugins: [],
};
export default config;
