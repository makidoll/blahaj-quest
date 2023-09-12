import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";
import type { AppProps } from "next/app";

// TODO: flashes on load, maybe ssr related

if (globalThis.localStorage != null) {
	globalThis.localStorage.setItem("chakra-ui-color-mode", "light");
}

const theme = extendTheme({
	initialColorMode: "light",
	useSystemColorMode: false,
	colors: {
		// material design pink
		brand: {
			50: "#fce4ec",
			100: "#f8bbd0",
			200: "#f48fb1",
			300: "#f06292",
			400: "#ec407a",
			500: "#e91e63",
			600: "#d81b60",
			700: "#c2185b",
			800: "#ad1457",
			900: "#880e4f",
			// a100: "#ff80ab",
			// a200: "#ff4081",
			// a400: "#f50057",
			// a700: "#c51162",
		},
		tomorrow: "#1d1f21",
		hexcorp: "#ff64ff",
		hexcorpDark: "#231929",
		justKindaDark: "#0f0f0f",
	},
	components: {
		Heading: {
			baseStyle: {
				letterSpacing: "-0.02em",
				// fontWeight: "600",
			},
		},
		Link: {
			baseStyle: {
				color: "whiteAlpha.700",
				fontWeight: "700",
				_hover: {
					textDecoration: "none",
				},
			},
		},
	},
	styles: {
		global: {
			body: {
				bg: "justKindaDark",
				color: "white",
			},
		},
	},
	fonts: {
		heading: `"Inter", sans-serif`,
		body: `"Inter", sans-serif`,
	},
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}
