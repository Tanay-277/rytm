"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import ThemeToggle from "./themeToggle";
import { motion, AnimatePresence } from "motion/react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Appbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Get user initials for avatar fallback
    const getUserInitials = () => {
        if (!session?.user?.name) return "?";
        return session.user.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-background/95 backdrop-blur-md shadow-sm py-2"
                : "bg-transparent py-4"
                }`}
        >
            <div className="container mx-auto flex items-center justify-between px-4">
                <Link href="/" className="font-bold text-xl tracking-tight">
                    rytm<span className="text-primary">.</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {["Home", "About", "Contact"].map((item) => (
                        <Link
                            key={item}
                            href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                            className="text-foreground/80 hover:text-primary transition-colors duration-200 text-sm font-medium relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
                                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                                        <AvatarFallback className="bg-primary/10 text-primary">{getUserInitials()}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <div className="px-2 py-1.5 text-sm font-medium">
                                        {session.user?.name}
                                    </div>
                                    <div className="px-2 pb-1.5 text-xs text-muted-foreground">
                                        {session.user?.email}
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                className="bg-primary hover:bg-primary/90 px-5 rounded-full transition-transform cursor-pointer active:scale-95"
                                onClick={() => signIn()}
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
                            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{getUserInitials()}</AvatarFallback>
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
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg md:hidden py-3 rounded-b-lg"
                        >
                            <div className="flex flex-col">
                                {["Home", "About", "Contact"].map((item) => (
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
                                            className="mx-6 my-3 text-destructive hover:text-destructive justify-start px-0"
                                            onClick={() => { setMobileMenuOpen(false); signOut(); }}
                                        >
                                            Sign Out
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        className="mx-6 my-3 bg-primary hover:bg-primary/90 rounded-full"
                                        onClick={() => { setMobileMenuOpen(false); signIn(); }}
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
