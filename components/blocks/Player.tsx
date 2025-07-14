"use client";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import { useAudioStore } from "@/store/audioStore";
import type { imgResolution } from "react-lite-youtube-embed";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Player() {
	const { volume } = useAudioStore();
	const [posterSize, setPosterSize] = useState<imgResolution>("maxresdefault");

	// const isSmallDevice = useMediaQuery({
	// 	query: "only screen and (max-width : 768px)",
	// });
	// const isMediumDevice = useMediaQuery({
	// 	query: "only screen and (min-width : 769px) and (max-width : 992px)",
	// });
	// const isLargeDevice = useMediaQuery({
	// 	query: "only screen and (min-width : 993px) and (max-width : 1200px)",
	// });
	// const isExtraLargeDevice = useMediaQuery({
	// 	query: "only screen and (min-width : 1201px)",
	// });
	// useEffect(() => {
	// 	setPosterSize(isSmallDevice ? "default" : "maxresdefault");
	// }, []);

	return (
		<div className="player relative w-full h-full rounded-xl overflow-hidden">
			<Image
				src="/assets/thumb/bg-1.png"
				alt="thumbnail"
				className="object-cover"
				fill
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw"
				priority
			/>
			{/* <LiteYouTubeEmbed
				id="IBkT4Yww7zk"
				poster={posterSize}
				title="What’s new in Material Design for the web (Chrome Dev Summit 2019)"
				muted={volume[0] === 0}
				// thumbnail="/assets/thumb/bg-1.png"
			/> */}
			<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-medium text-white">This is Phantom</h2>
					<div className="text-gray-300 text-sm">Spotify</div>
				</div>
			</div>
		</div>
	);
}
