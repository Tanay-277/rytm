import { Button } from "@/components/ui/button";
import {
	ArrowLeft,
	SquareLibrary,
	Telescope,
	Users,
	Waypoints,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getProviders, signIn } from "next-auth/react";
import GoogleSignInBtn from "@/components/blocks/GoogleSignInBtn";

const page = async () => {
	const providers = await getProviders();

	if (!providers) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-muted-foreground">No providers available</p>
			</div>
		);
	}

	return (
		<main className="w-full p-6 md:p-12 max-h-dvh">
			<nav className="w-full flex items-center justify-between">
				<Link href={"/"}>
					<Button size={"lg"} variant={"tertiary"}>
						<ArrowLeft /> back
					</Button>
				</Link>
				<Link href="/" className="font-bold text-2xl tracking-tight">
					rytm<span className="text-primary">.</span>
				</Link>
				{/* <h2>...</h2> */}
			</nav>
			<div className="container mx-auto flex justify-between mt-8 md:bg-background/50 md:p-6 rounded-2xl md:grainy md:border dark:border-input border-foreground/10">
				<div className="left flex flex-col justify-between">
					<div className="top">
						<h2 className="dark:text-muted-foreground text-foreground text-3xl font-semibold tracking-tight">
							Join the Symphony
						</h2>
						<p className="text-muted-foreground mt-3 max-w-md ml-1 leading-relaxed">
							Connect with fellow{" "}
							<span className="text-primary font-medium">
								music enthusiasts
							</span>
							, share your curated playlists, and discover new sounds that
							<span className="italic"> perfectly resonate</span> with your
							unique musical journey.
						</p>
						<div className="flex flex-row">
							<Card className="shadow-none mt-6 mb-8 w-full max-w-lg dark:bg-background/5 bg-background/40 border dark:border-input border-foreground/10">
								<CardHeader className="pb-2">
									<CardTitle className="text-xl">Platform Features</CardTitle>
									<CardDescription>
										Discover what makes rytm special
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 text-sm">
										<div className="flex items-center gap-2">
											<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
												<SquareLibrary className="h-4 w-4 text-primary" />
											</div>
											<span>Curated Playlists</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
												<Users className="h-4 w-4 text-primary" />
											</div>
											<span>Active Community</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
												<Telescope className="h-4 w-4 text-primary" />
											</div>
											<span>Music Discovery</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
												<Waypoints className="h-4 w-4 text-primary" />
											</div>
											<span>Easy Sharing</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
					<div className="bottom flex gap-4 flex-col">
						<GoogleSignInBtn providerId={providers.google.id} />
						<p className="text-muted-foreground text-sm text-center">
							By signing in, you agree to our Terms of Service and Privacy
							Policy.
						</p>
					</div>
				</div>
				<div className="right hidden md:block">
					<div className="grid grid-cols-2 gap-4 md:gap-6">
						<div className="flex flex-col gap-4 md:gap-6">
							<div className="overflow-hidden rounded-xl">
								<Image
									src="/assets/disc.jpg"
									alt="Disc artwork"
									width={320}
									height={320}
									className="w-full h-auto object-cover transition-transform hover:scale-105 duration-300"
								/>
							</div>
							<div className="overflow-hidden rounded-xl">
								<Image
									src="/assets/disc2.jpg"
									alt="Disc artwork"
									width={300}
									height={400}
									className="w-full h-auto object-cover transition-transform hover:scale-105 duration-300"
								/>
							</div>
							<Button
								size={"lg"}
								variant={"link"}
								className="rounded-lg cursor-default underline underline-offset-4"
							>
								Where words fail, Music speaks!
							</Button>
						</div>
						<div className="overflow-hidden rounded-xl relative">
							<Image
								src="/assets/surround.jpg"
								alt="Surround artwork"
								width={300}
								height={450}
								className=" w-full h-full object-cover transition-transform hover:scale-105 duration-300"
							/>
						</div>
					</div>
				</div>
			</div>
		</main>	
	);
};

export default page;
