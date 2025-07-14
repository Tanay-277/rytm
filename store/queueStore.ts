import { create } from "zustand"
import { createJSONStorage, persist, } from "zustand/middleware"

export enum SortOptions {
    Time,
    Alphabetical,
    Votes,
}
export type OrderByType = "asc" | "desc";

interface QueueStore {
    sortBy: SortOptions;
    orderBy: OrderByType;
    noOfTracks: number;
    currentPage: string;
    limit: string;
    hydrated: boolean;

    setSortBy: (value: SortOptions) => void;
    setOrderBy: (value: OrderByType) => void;
    setNoOfTracks: (value: number) => void;
    setPage: (value: string) => void;
    setLimit: (value: string) => void;
    setHydrated: (value: boolean) => void;
}
export const useQueueStore = create<QueueStore>()(
    persist(
        (set) => ({
            sortBy: SortOptions.Time,
            orderBy: "asc",
            noOfTracks: 0,
            currentPage: "1",
            limit: "10",
            hydrated: false,

            setSortBy: (value) => set({ sortBy: value }),
            setOrderBy: (value) => set({ orderBy: value }),
            setNoOfTracks: (value) => set({ noOfTracks: value }),
            setPage: (value) => set({ currentPage: value }),
            setLimit: (value) => set({ limit: value }),
            setHydrated: (value) => set({ hydrated: value }),
        }),
        {
            name: "queue-preferences",
            skipHydration: true,
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
            partialize: (state) =>
            ({
                sortBy: state.sortBy,
                orderBy: state.orderBy,
            }),
            storage: createJSONStorage(() => localStorage),
        }
    )
);