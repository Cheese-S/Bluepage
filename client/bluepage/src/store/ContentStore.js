import create from 'zustand';
import { persist } from 'zustand/middleware';

export const contentStore = create(persist(
    set => ({
        contentID: '',
        setContentID: (contentID) => set({ contentID }),
        subcontentList: [],
        setSubcontentList: (subcontentList) => set({ subcontentList }),
        pointer: -1,
        setPointer: (pointer) => set({ pointer }),
        contentName: '',
        setContentName: (contentName) => set({ contentName }),
        contentDescription: '',
        setContentDescription: (contentDescription) => set({ contentDescription }),
        contentFollowers: [],
        setContentFollowers: (contentFollowers) => set({ contentFollowers }),
        views: 0,
        setViews: (views) => set({ views }),
        tags: [],
        setTags: (tags) => set({ tags }),
        likes: 0,
        setLikes: (likes) => set({ likes }),
        dislikes: 0,
        setDislikes: (dislikes) => set({ dislikes }),
        setVotes: (likes, dislikes) => set({ likes, dislikes }),
        searchList: [],
        setSearchList: (searchList) => set({ searchList }),
        resetContentStore: () => set({ contentID: '', subcontentList: [], pointer: -1, contentName: '', contentDescription: '', contentFollowers: [], views: 0, tags: [], votes: [], searchList: [] }),
    }),
    {
        name: 'content-storage',
    },
));
