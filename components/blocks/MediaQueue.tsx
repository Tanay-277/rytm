"use client";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ArrowUp, ArrowUpFromDot, AudioLines, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useState } from "react";

interface Track {
	cover: string;
	thumbnail: string;
	title: string;
	id: string;
	type: string;
	UpVotes: number;
}

const tracks: Track[] = [
	{
		id: "1",
		cover: "/assets/thumb/bg-1.png",
		thumbnail: "/assets/thumb/bg-1.png",
		title: "Great Escape",
		type: "youtube",
		UpVotes: 5,
	},
	{
		id: "2",
		cover: "/assets/thumb/bg-2.png",
		thumbnail: "/assets/thumb/bg-2.png",
		title: "Midnight Symphony",
		type: "spotify",
		UpVotes: 8,
	},
	{
		id: "3",
		cover: "/assets/thumb/bg-3.png",
		thumbnail: "/assets/thumb/bg-3.png",
		title: "Ocean Waves",
		type: "youtube",
		UpVotes: 3,
	},
	{
		id: "4",
		cover: "/assets/thumb/bg-4.png",
		thumbnail: "/assets/thumb/bg-4.png",
		title: "Desert Dreams",
		type: "soundcloud",
		UpVotes: 6,
	},
	{
		id: "5",
		cover: "/assets/thumb/bg-5.png",
		thumbnail: "/assets/thumb/bg-5.png",
		title: "Urban Beats",
		type: "spotify",
		UpVotes: 10,
	},
	{
		id: "6",
		cover: "/assets/thumb/bg-6.png",
		thumbnail: "/assets/thumb/bg-6.png",
		title: "Mountain Echo",
		type: "youtube",
		UpVotes: 7,
	},
	{
		id: "7",
		cover: "/assets/thumb/bg-7.png",
		thumbnail: "/assets/thumb/bg-7.png",
		title: "Neon Lights",
		type: "spotify",
		UpVotes: 9,
	},
	{
		id: "8",
		cover: "/assets/thumb/bg-8.png",
		thumbnail: "/assets/thumb/bg-8.png",
		title: "Summer Vibes",
		type: "soundcloud",
		UpVotes: 4,
	},
	{
		id: "9",
		cover: "/assets/thumb/bg-9.png",
		thumbnail: "/assets/thumb/bg-9.png",
		title: "Cosmic Journey",
		type: "youtube",
		UpVotes: 12,
	},
	{
		id: "10",
		cover: "/assets/thumb/bg-10.png",
		thumbnail: "/assets/thumb/bg-10.png",
		title: "Electric Dreams",
		type: "spotify",
		UpVotes: 8,
	},
];

const users = [];

export default function MediaQueue() {
	const [vote, setVote] = useState(false);

	return (
		<div className="w-1/4 h-full flex flex-col bg-secondary/20 rounded-xl mb-2">
			<Tabs defaultValue="tracks" className="flex flex-col h-full">
				<header className="sticky top-0 z-10 p-4 flex items-center justify-between border-b bg-muted/10 backdrop-blur-sm rounded-t-xl">
					<span className="font-medium">Phantom Space</span>
					<div>
						<TabsList>
							<TabsTrigger value="tracks">
								<AudioLines className="h-4 w-4 mr-1" />
							</TabsTrigger>
							<TabsTrigger value="users">
								<UserRound className="h-4 w-4 mr-1" />
								{/* <span className="sr-only">Users</span> */}
							</TabsTrigger>
						</TabsList>
					</div>
				</header>
				<TabsContent value="tracks" className="px-4 flex-1 overflow-y-auto">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-medium my-2">Tracks</h3>
						<Select>
							<SelectTrigger className="w-fit rounded-full bg-primary-foreground text-foreground hover:bg-primary-foreground/50 ease-linear transition-all duration-300">
								<SelectValue placeholder="sort by" className="lowercase" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="date">Votes</SelectItem>
								<SelectItem value="status">Time</SelectItem>
								<SelectItem value="alpha">Alphabetical</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col space-y-3 py-2">
						{tracks.length > 0 ? (
							tracks.map((track) => (
								<div
									key={track.id}
									className="flex items-center space-x-3 p-2 rounded-md hover:bg-secondary/50 transition-colors"
								>
									<div className="w-12 h-12 rounded-md overflow-hidden cursor-pointer">
										<img
											src={track.thumbnail}
											alt={track.title}
											className="object-cover w-full h-full"
										/>
									</div>
									<div className="flex-1">
										<h4 className="text-sm font-medium line-clamp-1 mb-0.5">
											{track.title}
										</h4>
										<p className="text-xs text-muted-foreground capitalize">
											{track.type}
										</p>
									</div>
									<div className="flex items-center text-xs bg-muted/50 rounded-md overflow-hidden w-14 border-input border">
										<Button
											size="icon"
											variant="secondary"
											className="size-8 p-0 hover:bg-primary/10 hover:text-primary rounded-none flex-1/2 border-none"
										>
											<ArrowUp className="size-4" />
										</Button>
										<span className="font-medium text-center flex-1/2">
											{track.UpVotes}
										</span>
									</div>
								</div>
							))
						) : (
							<div className="flex flex-col items-center justify-center py-10 text-center">
								<AudioLines className="h-10 w-10 text-muted-foreground mb-2" />
								<h3 className="font-medium text-sm">No tracks in queue</h3>
								<p className="text-xs text-muted-foreground mt-1">
									Add some tracks to get the party started
								</p>
							</div>
						)}
					</div>
				</TabsContent>
				<TabsContent value="users" className="px-4 flex-1 overflow-y-auto">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-medium my-2">Users</h3>
					</div>
					<div className="flex flex-col items-center justify-center py-10 text-center">
						<UserRound className="h-10 w-10 text-muted-foreground mb-2" />
						<h3 className="font-medium text-sm">No users in the room</h3>
						<p className="text-xs text-muted-foreground mt-1">
							Invite friends to join this space
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
