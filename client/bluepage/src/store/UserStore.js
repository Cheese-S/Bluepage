import create from 'zustand';
import { persist } from 'zustand/middleware';

export const userStore = create(persist(
    set => ({
        id: '',
        setID: (id) => set({ id }),
        username: '',
        setUsername: (username) => set({ username }),
        comicNotifications: [],
        setComicNotifications: (comicNotifications) => set({ comicNotifications }),
        storyNotifications: [],
        setStoryNotifications: (storyNotifications) => set({ storyNotifications }),
        followers: [],
        setFollowers: (followers) => set({ followers }),
        followingUsers: [],
        setFollowingUsers: (followingUsers) => set({ followingUsers }),
        followingComics: [],
        setFollowingComics: (followingComics) => set({ followingComics }),
        followingStories: [],
        setFollowingStories: (followingStories) => set({ followingStories }),
        ownComics: [],
        setOwnComics: (ownComics) => set({ ownComics }),
        ownStores: [],
        setOwnStories: (ownStories) => set({ ownStories }),
        isLoggedIn: false,
        setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
        isAdmin: false,
        setIsAdmin: (isAdmin) => set({ isAdmin }),
        siteIsComicMode: false,
        setIsComicMode: (isComicMode) => set({ isComicMode }),
        resetStore: () => set({ id: '', username: '', comicNotifications: [], storyNotifications: [], followers: [], followingUsers: [], followingComics: [], followingStories: [], ownComics: [], ownStories: [], isLoggedIn: false, isAdmin: false }),
    }),
    {
        name: 'user-storage',
    },
));
