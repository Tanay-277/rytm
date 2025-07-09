"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./themeToggle";
import { signIn, signOut, useSession } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface User {
	name?: string;
	email?: string;
	image?: string;
}

const Appbar: React.FC = () => {
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const page = usePathname();

	const { data: session, status } = useSession();
	const isAuthenticated = status === "authenticated";

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 10);

		if (typeof window !== "undefined") {
			window.addEventListener("scroll", handleScroll);
			return () => window.removeEventListener("scroll", handleScroll);
		}
	}, []);

	const getUserInitials = () => {
		if (!session?.user?.name) return "?";
		return session.user.name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	return (
		<header
			className={cn(
				"sticky top-0 w-full z-50 transition-colors ease-linear duration-300 py-3 border-b border-transparent bg-transparent",
				{
					"border-accent bg-black/95 backdrop-blur-2xl": scrolled,
					"bg-transparent": !scrolled,
				}
			)}
		>
			<div className="container mx-auto items-center justify-between px-4 flex">
				<Link href="/" className="font-bold text-xl tracking-tight">
					rytm<span className="text-primary">.</span>
				</Link>

				<nav className="mobileNav items-center gap-8">
					{page === "home" && (
						<ul className="md:flex items-center gap-8 relative">
							<motion.div
								className="absolute h-8 rounded-full bg-primary/10 -z-10"
								layoutId="navBubble"
								id="bubble"
								initial={{ opacity: 0, width: 0 }}
								animate={{ opacity: 1 }}
								transition={{
									type: "spring",
									bounce: 0.2,
									duration: 0.6,
								}}
							/>
							{["Home", "About", "Contact"].map((item) => (
								<Link
									key={item}
									href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
									className={cn(
										"80 hover:text-primary transition-colors duration-200 text-sm font-medium relative px-4 py-1.5 rounded-full"
									)}
									onMouseEnter={(e) => {
										const target = e.currentTarget;
										const bubble = document.querySelector(
											"#bubble"
										) as HTMLElement;

										if (bubble) {
											bubble.animate(
												[
													{},
													{
														width: `${target.offsetWidth}px`,
														transform: `translateX(${target.offsetLeft}px)`,
													},
												],
												{
													duration: 600,
													fill: "forwards",
													easing: "cubic-bezier(0.2, 0, 0.2, 1)",
												}
											);
										}
									}}
								>
									{item}
								</Link>
							))}
						</ul>
					)}
					<div className="flex items-center gap-3">
						<ThemeToggle />
						{isAuthenticated ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
										<AvatarImage
											src={session?.user?.image || ""}
											alt={session?.user?.name || "User"}
										/>
										<AvatarFallback className="bg-primary/10 text-primary">
											{getUserInitials()}
										</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<div className="px-2 py-1.5 text-sm font-medium">
										{session?.user?.name}
									</div>
									<div className="px-2 pb-1.5 text-xs text-muted-foreground">
										{session?.user?.email}
									</div>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/profile">Profile</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/dashboard">Dashboard</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => signOut()}
										className="text-destructive focus:text-destructive"
									>
										Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button
								className=" px-5 rounded-full transition-transform cursor-pointer active:scale-95"
								onClick={() => signIn()}
								variant={"tertiary"}
							>
								Sign In
							</Button>
						)}
					</div>
				</nav>

				<div className="md:hidden flex items-center gap-3">
					<ThemeToggle />
					{isAuthenticated && (
						<Avatar className="h-8 w-8 mr-2">
							<AvatarImage
								src={session?.user?.image || ""}
								alt={session?.user?.name || "User"}
							/>
							<AvatarFallback className="bg-primary/10 text-primary text-xs">
								{getUserInitials()}
							</AvatarFallback>
						</Avatar>
					)}
					<button
						className="p-1 hover:bg-muted rounded-full transition-colors"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</button>
				</div>

				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
							layout
							className="absolute top-full left-0 right-0 bg-background/50 border-t border-border shadow-lg md:hidden py-3 rounded-b-lg backdrop-blur-lg"
						>
							<div className="flex flex-col">
								{page !== "Home" &&
									["Home", "About", "Contact"].map((item) => (
										<Link
											key={item}
											href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
											className="px-6 py-3 text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors"
											onClick={() => setMobileMenuOpen(false)}
										>
											{item}
										</Link>
									))}

								{isAuthenticated ? (
									<>
										<Link
											href="/profile"
											className="px-6 py-3 text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors"
											onClick={() => setMobileMenuOpen(false)}
										>
											Profile
										</Link>
										<Link
											href="/dashboard"
											className="px-6 py-3 text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors"
											onClick={() => setMobileMenuOpen(false)}
										>
											Dashboard
										</Link>
										<Button
											variant="ghost"
											className="mx-6 text-destructive hover:text-destructive justify-start px-0"
											onClick={() => {
												setMobileMenuOpen(false);
												signOut();
											}}
										>
											Sign Out
										</Button>
									</>
								) : (
									<Button
										className="mx-6 my-3 rounded-full"
										onClick={() => {
											setMobileMenuOpen(false);
											signIn();
										}}
										variant={"tertiary"}
									>
										Sign In
									</Button>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
};

export default Appbar;
