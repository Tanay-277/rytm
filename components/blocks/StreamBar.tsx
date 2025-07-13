"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import api, { type ApiResponse } from "@/lib/api-client";
import { Stream, StreamType } from "@prisma/client";
import { Toaster } from "../ui/sonner";
import { Loader2Icon } from "lucide-react";
import { detectMedia } from "@/lib/helpers";

const StreamBar = () => {
	const [newStream, setNewStream] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const handleNewStream = async () => {
		setLoading(true);
		const isUrlCorrect = detectMedia(newStream);
		// console.log(isUrlCorrect);

		if (!Object.values(StreamType).includes(isUrlCorrect.type as StreamType)) {
			setNewStream("");
			toast("Please enter a valid URL");
			setLoading(false);
			return;
		}
		if (!newStream.trim()) {
			toast.error("Please enter a valid URL");
			setLoading(false);
			return;
		}

		try {
			const url = newStream.split("&")[0];
			const resp = await api.post<{ stream: Stream }>("/streams", {
				creatorId: "e317c06f-2e7a-493d-b98a-8b286d099147", // TODO: Replace with dynamic creator ID
				url,
			});
			console.log(resp);

			if (resp.success) {
				toast.success(`${resp.data.stream.title} added to queue`);
				setNewStream("");
			} else {
				toast.error(resp.error || "Failed to add stream");
				console.error("API Error:", resp.error);
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error("Stream add error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Toaster />
			<div className="flex mt-2 gap-2">
				<Input
					placeholder="Enter new track"
					type="text"
					className="rounded-full h-10 z-10"
					value={newStream}
					onChange={(e) => setNewStream(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !loading) {
							handleNewStream();
						}
					}}
					disabled={loading}
				/>
				{!loading ? (
					<Button
						variant={"tertiary"}
						onClick={handleNewStream}
						className="w-20"
					>
						Add
					</Button>
				) : (
					<Button variant={"tertiary"} disabled className="w-20">
						<Loader2Icon className="animate-spin" />
						...
					</Button>
				)}
			</div>
		</>
	);
};

export default StreamBar;
