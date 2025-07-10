import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";


export async function POST(req: NextRequest) {
	const VoteSchema = z.object({
		streamId: z.string(),
	});
	try {
		const data = VoteSchema.parse(await req.json());
		const session = await getServerSession();

		if (!session?.user?.email) {
			return NextResponse.json(
				{ message: "Authentication required" },
				{ status: 401 }
			);
		}

		const user = await prisma.user.findFirst({
			where: {
				email: session?.user?.email ?? "",
			},
		});

		if (!user) {
			return NextResponse.json(
				{
					message: "User not found",
				},
				{
					status: 404,
				}
			);
		}

		const existingVote = await prisma.upVotes.findFirst({
			where: {
				streamId: data.streamId,
				userId: user.id,
			},
		});

		if (existingVote) {
			return NextResponse.json(
				{ message: "You have already upvoted this stream" },
				{ status: 409 }
			);
		}

		await prisma.upVotes.delete({
			where: {
				userId_streamId: {
					userId: user.id,
					streamId: data.streamId,
				},
			},
		});

		return NextResponse.json(
			{ message: "Downvote recorded successfully" },
			{ status: 201 }
		);
	} catch (e) {
		console.error("Error creating stream:", e);
		return NextResponse.json(
			{
				message: "Error while adding stream",
				error: e instanceof Error ? e.message : String(e),
			},
			{
				status: 411,
			}
		);
	}
}
