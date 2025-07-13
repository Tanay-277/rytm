"use client";

import { Volume, Volume1, Volume2, VolumeOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Slider } from "../ui/slider";
import { useState, useRef, useCallback, memo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/store/AudioStore";

type VolumeLevel = "mute" | "low" | "medium" | "high";

interface VolumeOption {
	icon: React.ReactNode;
	label: VolumeLevel;
	value: [number];
	ariaLabel: string;
}

const volumeOptions: VolumeOption[] = [
	{
		icon: <VolumeOff aria-hidden="true" />,
		label: "mute",
		value: [0],
		ariaLabel: "Volume muted",
	},
	{
		icon: <Volume aria-hidden="true" />,
		label: "low",
		value: [30],
		ariaLabel: "Volume low",
	},
	{
		icon: <Volume1 aria-hidden="true" />,
		label: "medium",
		value: [60],
		ariaLabel: "Volume medium",
	},
	{
		icon: <Volume2 aria-hidden="true" />,
		label: "high",
		value: [100],
		ariaLabel: "Volume high",
	},
];

interface AudioControlProps {
	className?: string;
	initialVolume?: [number];
}

function AudioControl({ className, initialVolume = [50] }: AudioControlProps) {
	const sliderRef = useRef<HTMLDivElement>(null);
	const lastVolumeRef = useRef<[number]>(initialVolume);
	const [isVisible, setIsVisible] = useState(false);
	const { volume, setVolume } = useAudioStore();

	useEffect(() => {
		if (volume[0] > 0) {
			lastVolumeRef.current = [...volume];
		}
	}, [volume]);

	const getCurrentVolumeState = useCallback(() => {
		const level = volume[0];
		const index = level === 0 ? 0 : level <= 30 ? 1 : level <= 60 ? 2 : 3;
		return volumeOptions[index];
	}, [volume]);

	const currentVolumeState = getCurrentVolumeState();

	const handleVolumeChange = useCallback(
		(newVolume: [number]) => {
			if (newVolume[0] !== volume[0]) {
				setVolume(newVolume);
			}
		},
		[setVolume, volume]
	);

	const toggleMute = useCallback(() => {
		if (volume[0] > 0) {
			lastVolumeRef.current = [...volume];
			setVolume([0]);
		} else {
			setVolume(
				lastVolumeRef.current[0] > 0 ? lastVolumeRef.current : initialVolume
			);
		}
	}, [volume, setVolume, initialVolume]);

	const handleVolumeScroll = useCallback(
		(e: React.WheelEvent) => {
			const direction = Math.sign(e.deltaY);
			const step = 5;
			const newVolume = Math.max(
				0,
				Math.min(100, volume[0] - direction * step)
			);
			setVolume([newVolume]);
		},
		[volume, setVolume]
	);

	return (
		<motion.div
			className={cn(
				"accentBtn !bg-transparent justify-start gap-3 hover:dark:bg-primary-foreground hover:bg-input cursor-default",
				className
			)}
			whileHover={{
				width: "234px",
			}}
			transition={{ ease: "easeOut", duration: 0.3 }}
			aria-label={`Volume control: ${currentVolumeState.ariaLabel}`}
			role="group"
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
		>
			<span
				className="w-[2ch] text-center flex items-center shrink-0"
				aria-hidden="true"
			>
				{volume[0]}
			</span>

			<button
				onClick={toggleMute}
				className="cursor-pointer border-none bg-transparent flex items-center justify-center w-max"
				aria-label={volume[0] === 0 ? "Unmute" : "Mute"}
			>
				{currentVolumeState.icon}
			</button>

			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { delay: 0 } }}
						transition={{ duration: 0.3, ease: "linear", delay: 0.5 }}
						className="flex-grow"
					>
						<Slider
							defaultValue={volume}
							value={volume}
							max={100}
							step={1}
							onValueChange={handleVolumeChange}
							ref={sliderRef}
							aria-label="Adjust volume"
							aria-valuemin={0}
							aria-valuemax={100}
							aria-valuenow={volume[0]}
							className="w-full"
							onWheel={(e) => handleVolumeScroll(e)}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

export default AudioControl;
