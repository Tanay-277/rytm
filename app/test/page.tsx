"use client";
import Appbar from "@/components/blocks/Appbar";
import AudioControl from "@/components/blocks/AudioControl";
import BetterThemeToggle from "@/components/blocks/BetterThemeToggle";
import { useState } from "react";

export default function Test() {
	const [volume, setVolume] = useState<number[]>([45]);
	return (
		<main className="flex flex-col">
			<Appbar />
			<section className="flex flex-col flex-1 px-12 mt-6">
				<div className="header flex items-center justify-between row">
					<div className="controls flex gap-2">
						<AudioControl volume={volume} setVolume={setVolume}/>
						<BetterThemeToggle />
					</div>
					<h2 className="text-3xl">Playing Right Now</h2>
				</div>
			</section>
		</main>
	);
}
