const EMPTY_USER = {
    name: null,
    email: null,
    isAdmin: false,
    comicNotifications: [],
    storyNotifications: [],
    followers: [],
    followingComics: [],
    followingStories: [],
    ownComics: [],
    ownStories: [],
    isLoggedIn: false,
}

const FOLLOW_ACTION_TYPE = {
    FOLLOW: 'follow',
    UNFOLLOW: 'unfollow'
}

const CONTENT_TYPE = {
    STORY: 'story',
    COMIC: 'comic'
}


module.exports = {
    EMPTY_USER,
    FOLLOW_ACTION_TYPE,
    CONTENT_TYPE
}