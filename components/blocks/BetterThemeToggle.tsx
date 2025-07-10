"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { AudioWaveform, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type ThemeType = "light" | "dark" | "system";

interface ThemeOption {
	value: ThemeType;
	label: string;
	icon: React.ReactNode;
}

export default function BetterThemeTogle() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [mounted, setMounted] = useState<boolean>(false);
	const { theme, setTheme } = useTheme();
	const themeContainerRef = useRef<HTMLDivElement>(null);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const themeOptions: ThemeOption[] = [
		{ value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
		{
			value: "system",
			label: "System",
			icon: <AudioWaveform className="h-4 w-4" />,
		},
		{ value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
	];

	const currentTheme = theme as ThemeType;

	const themeMap = {
		light: 0,
		system: -2.5,
		dark: -5,
	};

	const themeListY = `${themeMap[currentTheme] || 0}rem`;
	const currentThemeOption =
		themeOptions.find((opt) => opt.value === currentTheme) || themeOptions[1];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				themeContainerRef.current &&
				!themeContainerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const handleThemeToggle = () => {
		setIsOpen((prev) => !prev);
	};

	const handleThemeChange = (newTheme: ThemeType) => {
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
			debounceTimeoutRef.current = null;
		}

		setTheme(newTheme);

		debounceTimeoutRef.current = setTimeout(() => {
			setIsOpen(false);
			debounceTimeoutRef.current = null;
		}, 1500);
	};

	const handleThemeScroll = (e: React.WheelEvent) => {
		const themeOrder: ThemeType[] = ["light", "system", "dark"];
		const currentIndex = themeOrder.indexOf(currentTheme);

		if (currentIndex === -1) return;

		const direction = Math.sign(e.deltaY);
		let newIndex = currentIndex;

		if (direction < 0) {
			newIndex = (currentIndex - 1 + themeOrder.length) % themeOrder.length;
		} else if (direction > 0) {
			newIndex = (currentIndex + 1) % themeOrder.length;
		}

		handleThemeChange(themeOrder[newIndex]);
	};

	const handleThemeKey = (e: React.KeyboardEvent) => {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "Escape")
			return;

		e.preventDefault();

		if (e.key === "Escape") {
			setIsOpen(false);
			return;
		}

		const themeOrder: ThemeType[] = ["light", "system", "dark"];
		const currentIndex = themeOrder.indexOf(currentTheme);

		if (currentIndex === -1) return;

		const newIndex =
			e.key === "ArrowUp"
				? (currentIndex - 1 + themeOrder.length) % themeOrder.length
				: (currentIndex + 1) % themeOrder.length;

		handleThemeChange(themeOrder[newIndex]);
	};

	return (
		<div className="relative" ref={themeContainerRef}>
			<Button
				size="lg"
				variant="tertiary"
				className={cn(
					"grainy w-32 !bg-transparent capitalize delay-0",
					isOpen && "text-transparent !delay-300",
					"flex items-center gap-2"
				)}
				onClick={handleThemeToggle}
				onKeyDown={(e) => handleThemeKey(e)}
				aria-haspopup="true"
				aria-expanded={isOpen}
				aria-label={`Current theme: ${currentTheme}. Click to change`}
			>
				{currentThemeOption.icon} {currentThemeOption.label}
			</Button>
			<AnimatePresence>
				{isOpen && (
					<motion.ul
						className="themeList absolute left-0 w-full top-0"
						role="menu"
						initial={{ opacity: 0, zIndex: -10, translateY: themeListY }}
						animate={{ opacity: 1, zIndex: 10, translateY: themeListY }}
						exit={{ opacity: 0, zIndex: -10, translateY: themeListY }}
						transition={{ duration: 0.4, ease: "circInOut" }}
						onWheel={(e) => handleThemeScroll(e)}
					>
						{themeOptions.map((option) => (
							<li
								key={option.value}
								className={option.value}
								onClick={() => handleThemeChange(option.value)}
								role="menuitem"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										handleThemeChange(option.value);
									}
								}}
							>
								{option.icon} {option.label}
							</li>
						))}
					</motion.ul>
				)}
			</AnimatePresence>
		</div>
	);
}
