"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import api, { type ApiResponse } from "@/lib/api-client";
import { Stream, StreamType } from "@prisma/client";
import { Toaster } from "../ui/sonner";
import { Loader2Icon } from "lucide-react";
import { detectMedia, getMediaDetails } from "@/lib/helpers";
import { AnimatePresence, motion } from "motion/react";

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
			<div className="flex mt-2 gap-2 relative">
				{/* <AnimatePresence>
					{isPopVisible && Object.keys(trackDetails).length > 0 && (
						<motion.div
							className="popover bg-black/90 absolute -top-20 left-0 w-full p-4 rounded-md shadow-lg z-20"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
						>
							<div className="flex gap-3">
								{(trackDetails.thumbnail || trackDetails.cover) && (
									<img
										src={trackDetails.thumbnail || trackDetails.cover}
										alt="Track thumbnail"
										className="w-16 h-16 object-cover rounded"
									/>
								)}
								<div className="text-white">
									<h3 className="font-bold">
										{trackDetails.title || "Unknown Title"}
									</h3>
									<p className="text-sm text-gray-300">
										{trackDetails.type || "Unknown Type"}
									</p>
									<p className="text-xs text-gray-400">
										ID: {trackDetails.id || "Unknown"}
									</p>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence> */}
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
