import { YouTube } from "youtube-sr";
import YTMusic from "ytmusic-api"

// Regular expression for YouTube URLs
const YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:(?:watch\?v=|embed\/|v\/|shorts\/)([a-zA-Z0-9_-]{11})|channel\/([a-zA-Z0-9_-]+)|user\/([a-zA-Z0-9_-]+)|@([a-zA-Z0-9_-]+)|playlist\?list=([a-zA-Z0-9_-]+))$/;

// Regular expression for YouTube Music URLs
const YT_MUSIC_REGEX = /^(?:https?:\/\/)?music\.youtube\.com\/(?:watch\?v=([a-zA-Z0-9_-]{11})(?:&[^#\s]*)?|playlist\?list=([a-zA-Z0-9_-]+)|browse\/([a-zA-Z0-9_-]+)|channel\/([a-zA-Z0-9_-]+))/;

// Regular expression for Spotify URLs
const SPOT_REGEX = /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/(track|playlist|album|artist|show)\/([a-zA-Z0-9]+)$/;

/**
 * Detects the type of media from a URL
 * @param url The URL to detect
 * @returns An object containing information about the detected media
 */

import type { StreamType } from "@prisma/client";

export function detectMedia(url: string): { type: StreamType } {
    if (YT_REGEX.test(url)) {
        return {
            type: "Youtube" as StreamType,
        };
    }

    if (YT_MUSIC_REGEX.test(url)) {
        return {
            type: "Youtube_Music" as StreamType,
        };
    }

    if (SPOT_REGEX.test(url)) {
        return {
            type: "Spotify" as StreamType,
        };
    }

    return { type: "Unknown" as StreamType };
}

/**
 * Gets detailed information about media from a URL
 * @param url The URL to fetch details for
 * @returns Media details based on the URL type or null if not found/error
 */
export async function getMediaDetails(url: string): Promise<{
    type: string;
    id: string;
    title?: string;
    thumbnail?: string;
    cover?: string;
} | null> {

    if (!url || typeof url !== 'string') {
        return null;
    }

    const mediaType = detectMedia(url).type;
    // console.log(mediaType);


    try {
        if (mediaType === "Youtube") {
            const match = url.match(YT_REGEX);
            if (!match) return null;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, videoId, artistId, userId, handle, playlistId] = match;

            if (videoId) {
                const video = await YouTube.getVideo(url);
                return {
                    type: "Youtube",
                    id: videoId,
                    title: video.title || "",
                    thumbnail: video.thumbnail?.url || "",
                    cover: video.thumbnail?.url || ""
                };
            } else if (playlistId) {
                const playlist = await YouTube.getPlaylist(playlistId);
                return {
                    type: "Youtube_Playlist",
                    id: playlistId,
                    title: playlist.title || "",
                    thumbnail: playlist.thumbnail?.url || "",
                    cover: playlist.thumbnail?.url || ""
                };
            } else if (artistId || userId || handle) {
                return {
                    type: "Youtube_Channel",
                    id: artistId || userId || handle || "",
                    title: "",
                    thumbnail: "",
                    cover: ""
                };
            }
        }
        else if (mediaType === "Youtube_Music") {
            const match = url.match(YT_MUSIC_REGEX);
            if (!match) return null;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, videoId, watchlistId, playlistId, browseId, artistId] = match;

            try {
                const ytmusic = new YTMusic();
                await ytmusic.initialize();

                if (videoId) {
                    const video = await ytmusic.getVideo(videoId);
                    return {
                        type: "Youtube_Music",
                        id: videoId,
                        title: video.name || "",
                        thumbnail: video.thumbnails?.at(-1)?.url || "",
                        cover: video.thumbnails?.[0]?.url || ""
                    };
                } else if (playlistId || watchlistId) {
                    const listId = playlistId || watchlistId || "";
                    const playlist = await ytmusic.getPlaylist(listId);
                    return {
                        type: "Youtube_Music_Playlist",
                        id: listId,
                        title: playlist.name || "",
                        thumbnail: playlist.thumbnails?.[0]?.url || "",
                        cover: playlist.thumbnails?.[0]?.url || ""
                    };
                } else if (browseId || artistId) {
                    const artist = await ytmusic.getArtist(artistId)
                    return {
                        type: "Youtube_Music_Artist",
                        id: artistId || "",
                        title: artist.name,
                        thumbnail: artist.thumbnails?.at(-1)?.url || "",
                        cover: artist.thumbnails?.[0]?.url || ""
                    };
                }
            } catch (musicError) {
                console.error("YouTube Music API error:", musicError);
                return null;
            }
        }
        else if (mediaType === "Spotify") {
            const match = url.match(SPOT_REGEX);
            if (!match) return null;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, spotifyType, id] = match;
            return {
                type: `Spotify_${spotifyType.charAt(0).toUpperCase() + spotifyType.slice(1)}`,
                id: id,
                title: "",
                thumbnail: "",
                cover: ""
            };
        }

        return null;
    } catch (error) {
        console.error("Error fetching media details:", error instanceof Error ? error.message : String(error));
        return null;
    }
}
