"use client";
import type React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface GoogleSignInBtnProps {
	providerId: string;
	callbackUrl?: string;
}

const GoogleSignInBtn: React.FC<GoogleSignInBtnProps> = ({
	providerId,
	callbackUrl = "/home",
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

	return (
		<Button
			variant={"tertiary"}
			className="text-base sm:text-lg lg:text-xl h-12 sm:h-14 lg:h-16 flex gap-3 sm:gap-4 items-center justify-center w-full transition-all duration-200"
			disabled={isLoading}
			aria-label="Sign in with Google"
			type="button"
			onClick={handleSignIn}
		>
			{isLoading ? (
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
					<span>Amplifying...</span>
				</div>
			) : (
				<>
					<Image
						src={"/assets/icons/google.png"}
						width={20}
						height={20}
						alt="Google logo"
						priority
						className="w-5 h-5 sm:w-6 sm:h-6"
					/>
					<span className="font-medium">Flute Up with Google</span>
				</>
			)}
		</Button>
	);
};

export default GoogleSignInBtn;
