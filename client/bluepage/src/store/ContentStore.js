import create from 'zustand';
import { persist } from 'zustand/middleware';

export const contentStore = create(persist(
    set => ({
        contentID: '',
        setContentID: (contentID) => set({ contentID }),
        contentList: [],
        setContentList: (subcontentList) => set({ subcontentList }),
        pointer: -1,
        setPointer: (pointer) => set({ pointer }),
        loadContent: (contentID, contentList) => set({ contentID, contentList, pointer: -1 }),
    }),
    {
        name: 'content-storage',
    },
));
