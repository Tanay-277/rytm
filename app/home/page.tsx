import Appbar from "@/components/blocks/Appbar";
import AudioControl from "@/components/blocks/AudioControl";
import BetterThemeToggle from "@/components/blocks/BetterThemeToggle";
import MediaQueue from "@/components/blocks/MediaQueue";
import Player from "@/components/blocks/Player";
import StreamBar from "@/components/blocks/StreamBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
	const session = await getServerSession();
	if (!session) {
		redirect("/sign-in");
	}
	return (
		<main className="flex flex-col h-screen">
			<Appbar />
			<section className="flex flex-col flex-1 px-6 py-4 overflow-hidden">
				<div className="header flex items-center justify-between mb-4">
					<div className="controls flex gap-2">
						<AudioControl />
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
						<Player />
						<StreamBar />
					</div>
				</div>
			</section>
		</main>
	);
}
