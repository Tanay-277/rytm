"use client";

import { MoveLeftIcon, Volume, Volume2 } from "lucide-react";
import { Button } from "../ui/button";
import { animate, motion, useAnimate } from "motion/react";
import { Slider } from "../ui/slider";
import { Dispatch, SetStateAction, useState, useRef } from "react";

export default function AudioControl({
	volume,
	setVolume,
}: {
	volume: number[];
	setVolume: Dispatch<SetStateAction<number[]>>;
}) {
	const [showVolume, setShowVolume] = useState(true);
	const [volumeSlider, animate] = useAnimate();

	const handleVolume = () => {
		console.log("handling volume");
		animate(
			volumeSlider.current,
			{ display: "flex", opacity: 1 },
			{ duration: 0.8, delay: 0.6 }
		);
	};

	return (
		<motion.div
			className="accentBtn justify-start gap-4 hover:none"
			whileHover={{
				width: "226px",
			}}
			transition={{ ease: "easeInOut", duration: 0.6 }}
			onMouseOver={handleVolume}
		>
			{volume}
			<Volume2 />
			<Slider
				defaultValue={volume}
				max={100}
				step={1}
				onValueChange={(val) => {
					setVolume(val);
				}}
				ref={volumeSlider}
				className="hidden opacity-0"
			/>
		</motion.div>
	);
}
