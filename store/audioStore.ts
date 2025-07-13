import { create } from "zustand"

interface AudioState {
    currentTrack: {
        id: string;
        title: string;
        url: string;
        thumbnail: string;
    } | null;

    isPlaying: boolean;
    volume: [number];
    currentTime: number;
    duration: number;

    queue: Array<any>;
    queueIndex: number;

    setCurrentTrack: (track: any) => void;
    togglePlayPause: () => void;
    setVolume: (volume: [number]) => void;
    nextTrack: () => void;
    previousTrack: () => void;
    updateProgress: (currentTime: number, duration: number) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    currentTrack: null,
    isPlaying: false,
    volume: [45],
    currentTime: 0,
    duration: 0,
    queue: [],
    queueIndex: 0,

    setCurrentTrack: (track) => set({ currentTrack: track }),

    togglePlayPause: () => set((state) => ({
        isPlaying: !state.isPlaying
    })),

    setVolume: (volume) => set({ volume }),

    nextTrack: () => set((state) => {
        const nextIndex = Math.min(state.queueIndex + 1, state.queue.length - 1);
        return {
            queueIndex: nextIndex,
            currentTrack: state.queue[nextIndex] || null
        };
    }),
    previousTrack: () => set((state) => {
        const prevIndex = Math.max(state.queueIndex - 1, 0);
        return {
            queueIndex: prevIndex,
            currentTrack: state.queue[prevIndex] || null
        };
    }),

    updateProgress: (currentTime, duration) => set({
        currentTime,
        duration
    }),
}))