"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

interface GoogleSignInBtnProps {
	providerId: string;
	callbackUrl?: string;
}

const GoogleSignInBtn: React.FC<GoogleSignInBtnProps> = ({
	providerId,
	callbackUrl = "/",
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSignIn = async () => {
		try {
			setIsLoading(true);
			await signIn(providerId, { callbackUrl });
		} catch (error) {
			console.error("Google sign-in error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const isMobile = useMediaQuery({ width: 767 });

	return (
		<Button
			size={isMobile ? "sm" : "lg"}
			variant={"tertiary"}
			className="text-lg md:text-xl h-12 md:h-16 flex gap-4 items-center justify-center w-full"
			onClick={handleSignIn}
			disabled={isLoading}
			aria-label="Sign in with Google"
			type="button"
		>
			{isLoading ? (
				<span className="animate-pulse">Amplifying...</span>
			) : (
				<>
					<Image
						src={"/assets/icons/google.png"}
						width={24}
						height={24}
						alt="Google logo"
						priority
					/>
					Flute Up with Google
				</>
			)}
		</Button>
	);
};

export default GoogleSignInBtn;
