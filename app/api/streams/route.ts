import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { YouTube, type Video } from "youtube-sr";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";

const YT_REGEX = new RegExp(
    "(?:https?:\\/\\/)?(?:www\\.)?(?:youtube\\.com|music\\.youtube\\.com)\\/watch\\?v=([\\w\\-]{11})|(?:https?:\\/\\/)?(?:www\\.)?youtu\\.be\\/([\\w\\-]{11})"
);

const SPOT_REGEX = new RegExp(
    "(?:https?://)?open.spotify.com/(track|album|playlist)/([\\w]+)"
);

const CreateStreamSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Stream title should of of minimum 3 chars" }),
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
        const isYT = YT_REGEX.test(data.url);
        let extractedId;

        if (isYT) {
            const match = data.url.match(YT_REGEX);
            extractedId = match ? match[1] || match[2] : null;
        } else {
            const isSpot = SPOT_REGEX.test(data.url);
            if (!isSpot) {
                return NextResponse.json(
                    { message: "Enter a valid URL" },
                    { status: 411 }
                );
            }
            const match = data.url.match(SPOT_REGEX);
            extractedId = match ? match[2] : null;
        }

        if (!extractedId) {
            return NextResponse.json(
                { message: "Could not extract valid ID from URL" },
                { status: 411 }
            );
        }

        const media: Video = await YouTube.getVideo(data.url)
        console.log(media);

        // console.log(JSON.stringify(media));

        const stream = await prisma.stream.create({
            data: {
                title: data.title,
                userId: data.creatorId,
                type: isYT ? "Youtube" : "Spotify",
                extractedId,
                url: data.url,
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
