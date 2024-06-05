import { CSSReset, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { AppProps } from "next/app";
import "../styles/cm-dark.css";
import "../styles/cm-light.css";
import "../styles/globals.css";
import theme from "../theme";

declare global {
	interface Window {
		gapi: any;
		pickerInited: boolean;
		gisInited: boolean;
		tokenClient: any;
		google: any;
	}
}

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<ColorModeScript />
			<CSSReset />
			<Component {...pageProps} />
		</ChakraProvider>
	);
}
