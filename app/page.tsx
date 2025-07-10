"use client";
import Appbar from "@/components/blocks/Appbar";

export default function Home() {
	return (
		<main>
			<Appbar />
			<div className="min-h-[90dvh] flex flex-col justify-center items-center overflow-hidden relative font-mono">
				<div className="text-center">
					<h1 className="text-7xl md:text-8xl font-light tracking-tight text-gray-800 dark:text-gray-200">
						RYTM
					</h1>
					<p className="text-lg md:text-base tracking-widest text-gray-600 dark:text-gray-400 mt-2">
						FEEL THE BEAT
					</p>
				</div>

				<div className="w-16 h-[1px] bg-gray-400 my-12"></div>

				<div className="text-center mb-8">
					<p className="text-xs uppercase tracking-wider text-gray-500">
						Sound • Motion • Harmony
					</p>
				</div>
			</div>
		</main>
	);
}
