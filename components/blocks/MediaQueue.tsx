"use client";
import { Button } from "../ui/button";
import { ArrowUp, ArrowUpFromDot, AudioLines, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import api, { ApiResponse } from "@/lib/api-client";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { Stream, UpVotes } from "@prisma/client";
import { useSession } from "next-auth/react";

type Track = Stream & {
	UpVotes: UpVotes[];
};

export default function MediaQueue() {
	const { data: session } = useSession();
	const userId = session?.user?.id;
	console.log(userId);
	

	const [tracks, setTracks] = useState<Track[]>([]);
	const [noTracks, setNoTracks] = useState<number>(0);

	const getTracks = async (): Promise<
		ApiResponse<{ streams: Track[]; totalStreams: number }>
	> => {
		const tracks = await api.get<{ streams: Track[]; totalStreams: number }>(
			"/streams",
			{
				creatorId: "e317c06f-2e7a-493d-b98a-8b286d099147", // TODO: Replace with dynamic creator ID
				page: "1",
				limit: "10",
			}
		);
		console.log(tracks);

		return tracks;
	};

	const handleUpVote = async (trackId: string) => {
		const vote = await api.post("/streams/upvotes", {
			streamId: trackId,
		});

		if (vote.success) {
			getTracks().then((resp) => {
				if (resp.success) {
					setTracks(resp.data.streams);
					setNoTracks(resp.data.totalStreams);
				}
			});
		} else {
			toast.error(vote.error || "Failed to upvote");
		}
	};

	useEffect(() => {
		getTracks().then(
			(resp: ApiResponse<{ streams: Track[]; totalStreams: number }>) => {
				if (!resp.success) {
					toast.error(resp.error || "Failed to fetch streams");
					console.error("API Error:", resp.error);
				} else {
					setTracks(resp.data.streams);
					setNoTracks(resp.data.totalStreams);
				}
			}
		);
	}, []);

	return (
		<div className="w-1/4 h-full flex flex-col bg-secondary/20 rounded-xl mb-2">
			<Toaster />
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
											className="object-contain w-full h-full"
										/>
									</div>
									<div className="flex-1">
										<h4 className="text-sm font-medium line-clamp-1 mb-0.5">
											{track.title}
										</h4>
										<p className="text-xs text-muted-foreground capitalize">
											{track.type.replace("_", " ")}
										</p>
									</div>
									<div className="flex items-center text-xs bg-muted/50 rounded-md overflow-hidden w-14 border-input border">
										<Button
											size="icon"
											variant="secondary"
											className="size-8 p-0 hover:bg-primary/10 hover:text-primary rounded-none flex-1/2 border-none"
											onClick={() => {
												handleUpVote(track.id);
											}}
											disabled={
												!userId ||
												!!track.UpVotes.find(
													(stream: UpVotes) => stream.userId === userId
												)
											}
										>
											<ArrowUp className="size-4" />
										</Button>
										<span className="font-medium text-center flex-1/2">
											{track.UpVotes.length}
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
