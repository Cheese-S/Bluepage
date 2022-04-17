import create from 'zustand';
import { useHistory } from 'react-router-dom';

export const userStore = create(set => ({
    id: '',
    setID: (id) => set({ id }),
    username: '',
    setUsername: (username) => set({ username }),
    newComicNotifications: [],
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
}));

export const history = useHistory();