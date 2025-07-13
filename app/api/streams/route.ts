import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { detectMedia, getMediaDetails } from "@/lib/helpers";

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z
        .string()
        .refine((url) => url.includes("youtube") || url.includes("spotify"), {
            message: "Incorrect URL",
        }),
});

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const { type } = detectMedia(data.url)
        const mediaDetails = await getMediaDetails(data.url)
        console.log(mediaDetails);

        if (!mediaDetails)
            return NextResponse.json({
                message: "Error retrieving details."
            }, {
                status: 403
            })

        const stream = await prisma.stream.create({
            data: {
                title: mediaDetails.title ?? "",
                userId: data.creatorId,
                type,
                extractedId: mediaDetails.id,
                url: data.url,
                thumbnail: mediaDetails.thumbnail ?? "",
                cover: mediaDetails.cover ?? ""
            },
        });

        return NextResponse.json(
            { message: "Stream created successfully", stream },
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

export async function GET(req: NextRequest) {
    try {
        const creatorId = req.nextUrl.searchParams.get("creatorId");
        const pageParam = req.nextUrl.searchParams.get("page") || "1";
        const limitParam = req.nextUrl.searchParams.get("limit") || "10";

        // Parse and validate pagination parameters
        const page = parseInt(pageParam, 10);
        const limit = parseInt(limitParam, 10);

        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
            return NextResponse.json(
                { message: "Invalid pagination parameters" },
                { status: 400 }
            );
        }

        if (!creatorId) {
            return NextResponse.json(
                { message: "Missing required creatorId parameter" },
                { status: 400 }
            );
        }

        const skip = (page - 1) * limit;

        const [streams, totalStreams] = await prisma.$transaction([
            prisma.stream.findMany({
                where: {
                    userId: creatorId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    UpVotes: true
                },
                skip,
                take: limit,
            }),
            prisma.stream.count({
                where: {
                    userId: creatorId,
                },
            }),
        ]);


        return NextResponse.json(
            {
                message: "Streams retrieved successfully",
                streams,
                totalStreams,
            },
            { status: 200 }
        );
    } catch (e) {
        console.error("Error retrieving streams:", e);
        return NextResponse.json(
            {
                message: "Error while retrieving streams",
                error: e instanceof Error ? e.message : String(e),
            },
            { status: 500 }
        );
    }
}
