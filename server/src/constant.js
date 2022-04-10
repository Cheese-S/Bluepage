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
    UNFOLLOW: 'unfollow',
    invert: (action) => {
        return action === FOLLOW_ACTION_TYPE.FOLLOW ? FOLLOW_ACTION_TYPE.UNFOLLOW : FOLLOW_ACTION_TYPE.FOLLOW;
    }
}

const COMMENT_ACTION_TYPE = {
    COMMENT: 'comment',
    SUBCOMMENT: 'subcomment',

}

const CONTENT_TYPE = {
    STORY: 'story',
    COMIC: 'comic',
    getSubcontentType: (contentType) => {
        return contentType === CONTENT_TYPE.STORY ? SUBCONTENT_TYPE.CHAPTER : SUBCONTENT_TYPE.PAGE;
    },
    doTypesAgree: (subcontentType, contentType) => {
        return (
            (subcontentType === SUBCONTENT_TYPE.CHAPTER && contentType === CONTENT_TYPE.STORY) ||
            (subcontentType === SUBCONTENT_TYPE.PAGE && contentType === CONTENT_TYPE.COMIC)
        )
    }
}

const SUBCONTENT_TYPE = {
    CHAPTER: 'chapter',
    PAGE: 'page',
    getContentType: (contentType) => {
        return contentType === SUBCONTENT_TYPE.CHAPTER ? CONTENT_TYPE.STORY : CONTENT_TYPE.COMIC;
    },
    doTypesAgree: CONTENT_TYPE.doTypesAgree
}

const BP_TAGS = {
    ACTION: 'Action',
    ROMANCE: 'Romance',
    MYSTERY: 'Mystery',
    FANTASY: 'Fantasy',
    HISTORICAL: 'Historical',
    COMEDY: 'Comedy',
    FANWORK: 'Fanwork',
    SCI_FI: 'Sci-Fi',
    THRILLER: 'Thriller',
    PSYCHOLOGICAL: 'Psychological'
}

const VOTE_STATE_TYPE = {
    LIKE: 'like',
    DISLIKE: 'dislike',
    NEUTRAL: 'neutral'
}


module.exports = {
    EMPTY_USER,
    FOLLOW_ACTION_TYPE,
    COMMENT_ACTION_TYPE,
    CONTENT_TYPE,
    SUBCONTENT_TYPE,
    VOTE_STATE_TYPE,
    BP_TAGS
}