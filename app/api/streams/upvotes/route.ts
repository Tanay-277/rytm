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

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		});

		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
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

		await prisma.upVotes.create({
			data: {
				streamId: data.streamId,
				userId: user.id,
			},
		});

		return NextResponse.json(
			{ message: "Upvote recorded successfully" },
			{ status: 201 }
		);
	} catch (e) {
		console.error("Error recording upvote:", e);

		if (e instanceof z.ZodError) {
			return NextResponse.json(
				{ message: "Invalid request data", errors: e.errors },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
