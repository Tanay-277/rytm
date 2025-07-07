import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import localFont from "next/font/local";

export const metadata: Metadata = {
	title: "RYTM",
	description: "Collaborative music streaming",
};

const GeneralSans = localFont({
	src: [
		{ path: "fonts/GeneralSans/GeneralSans-Variable.woff2", style: "normal" },
		{
			path: "fonts/GeneralSans/GeneralSans-VariableItalic.woff2",
			style: "italic",
		},
	],
	display: "swap",
	preload: true,
	variable: "--font-general-sans",
});

const JetbrainsMono = localFont({
	src: "/fonts/JetbrainsMono/JetBrainsMonoVariable.woff2",
	display: "swap",
	variable: "--font-jetbrains-mono",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${GeneralSans.variable} ${JetbrainsMono.variable}`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
