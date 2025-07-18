"use client";
import Appbar from "@/components/blocks/Appbar";
import BetterThemeToggle from "@/components/blocks/BetterThemeToggle";
import MediaQueue from "@/components/blocks/MediaQueue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share } from "lucide-react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";

export default function Test() {
	return (
		<main className="flex flex-col h-screen">
			<Appbar />
			<section className="flex flex-col flex-1 px-6 py-4 overflow-hidden">
				<div className="header flex items-center justify-between mb-4">
					<div className="controls flex gap-2">
						{/* <AudioControl volume={volume} setVolume={setVolume} /> */}
						<BetterThemeToggle />
						<Button size={"lg"} variant={"tertiary"}>
							<Share />
						</Button>
					</div>
					<Button
						size={"lg"}
						variant={"link"}
						className="flex items-center gap-2"
					>
						<Avatar>
							<AvatarImage src="/assets/user.jpeg" />
							<AvatarFallback>TS</AvatarFallback>
						</Avatar>
						<span>Streamer</span>
					</Button>
					<div className="media flex items-center gap-2">
						<h2 className="text-2xl">Playing Right Now</h2>
					</div>
				</div>

				<div className="flex flex-1 gap-4 overflow-hidden">
					<MediaQueue />
					<div className="w-3/4 flex flex-col mb-2">
						<div className="player relative w-full h-full rounded-xl overflow-hidden">
							{/* <Image
								src="/assets/thumb/bg-1.png"
								alt="thumbnail"
								className="object-cover"
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw"
								priority
							/> */}
							<LiteYouTubeEmbed
								id="IBkT4Yww7zk"
								title="What’s new in Material Design for the web (Chrome Dev Summit 2019)"
								// thumbnail="/assets/thumb/bg-1.png"
							/>
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
								<div className="flex justify-between items-center">
									<h2 className="text-xl font-medium text-white">
										This is Phantom
									</h2>
									<div className="text-gray-300 text-sm">Spotify</div>
								</div>
							</div>
						</div>
						<div className="flex mt-2 gap-2">
							<Input
								placeholder="Enter new track"
								type="text"
								className="rounded-full h-10 z-10"
							/>
							<Button variant={"tertiary"}>Add</Button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
