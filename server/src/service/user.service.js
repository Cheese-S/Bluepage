const UserModel = require('../model/user.model')
const { omit } = require('lodash');
const { logger } = require('bs-logger');
const bcrypt = require('bcrypt');
const env = require('../env.config')
const CONSTANT = require('../constant')
const ContentService = require('./content.service')


function getUserVoteAction(contentType, subcontentType, prev, current, contentID) {
    let postfix, doAction = {}, undoAction = {};

    if (contentType) {
        postfix = contentType === CONSTANT.CONTENT_TYPE.COMIC ? 'Comics' : 'Stories'
    } else {
        postfix = subcontentType === CONSTANT.SUBCONTENT_TYPE.CHAPTER ? 'Chapters' : 'Pages'
    }

    if (prev === CONSTANT.VOTE_STATE_TYPE.DISLIKE) {
        let target = `disliked${postfix}`;
        doAction['$pull'] = {}
        doAction['$pull'][target] = contentID;
    } else if (prev === CONSTANT.VOTE_STATE_TYPE.LIKE) {
        let target = `liked${postfix}`;
        doAction['$pull'] = {}
        doAction['$pull'][target] = contentID;
    }

    if (current === CONSTANT.VOTE_STATE_TYPE.DISLIKE) {
        let target = `disliked${postfix}`;
        doAction['$addToSet'] = {}
        doAction['$addToSet'][target] = contentID;
    } else if (current === CONSTANT.VOTE_STATE_TYPE.LIKE) {
        let target = `liked${postfix}`;
        doAction['$addToSet'] = {}
        doAction['$addToSet'][target] = contentID;
    }



    return {
        ...undoAction,
        ...doAction
    }
}

const UserService = {

    /**
     * Custom type for creating user 
     * @typedef {Object} UserInput
     * @property {string} name
     * @property {string} email
     * @property {string} password
     * @property {[string]} answers
     */

    /**
     * 
     * @param {UserInput} input 
     * @returns The newly created user
     */
    createUser: async (input) => {
        const hashedPwd = await bcrypt.hash(input.password, env.SALT_FACTOR);
        const hashedAnswers = input.answers.map((str) => bcrypt.hashSync(str, env.SALT_FACTOR));

        return UserModel.create({
            name: input.name,
            email: input.email,
            password: hashedPwd,
            answers: hashedAnswers,
            isAdmin: false
        });
    },

    findUser: async (query, option = { lean: true }) => {
        return UserModel.findOne(query, null, option);
    },

    updateUser: async (query, update, option = { lean: true, new: true }) => {
        return UserModel.findOneAndUpdate(query, update, option);
    },

    updateManyUser: async (query, update, option) => {
        return UserModel.updateMany(query, update, option);
    },

    deleteUserContent: async (contentType, contentID, userID) => {
        if (contentType === CONSTANT.CONTENT_TYPE.COMIC) {
            return UserService.updateUser(
                { _id: userID },
                { $pull: { ownComics: contentID } },
                { lean: false, new: true }
            )
        } else {
            return UserService.updateUser(
                { _id: userID },
                { $pull: { ownStories: contentID } },
                { lean: false, new: true }
            )
        }
    },

    getUser: async (userID, published) => {
        if (published) {
            return UserModel.findOne(
                {_id: userID}
            )
            .populate({
                path: 'ownComics',
                select: '-comments -contentList',
                match: { published: published }
            })
            .populate({
                path: 'ownStories',
                select: '-comments -contentList',
                match: { published: published },
            })
        } else {
            return UserModel.findOne(
                {_id: userID}
            )
            .populate({
                path: 'ownComics',
                select: '-comments -contentList',
            })
            .populate({
                path: 'ownStories',
                select: '-comments -contentList'
            })
        }
        
    },

    followUser: async (selfID, userID, action) => {
        let update = { $addToSet: { followers: selfID } };
        if (action === CONSTANT.FOLLOW_ACTION_TYPE.UNFOLLOW) {
            update = { $pull: { followers: selfID } };
        }
        return UserService.updateUser(
            { _id: userID },
            update,
            { lean: false, new: true }
        )
    },

    /**
     * Pa
     * @param {String} nameOrEmail 
     * @param {String} pwd 
     */
    loginUser: async (nameOrEmail, pwd) => {
        try {
            const user = await UserService.findUser(
                { $or: [{ name: nameOrEmail }, { email: nameOrEmail }] },
                { lean: false }
            )
            if (!user) {
                throw new Error("The user with this email or name does not exist");
            }
            const isValid = await bcrypt.compare(pwd, user.password);
            if (!isValid) {
                throw new Error("The username / email or your password is not correct");
            }
            return user; 
        } catch (e) {
            throw e;
        }
    },

    followContent: async (userID, contentID, contentType, followActionType) => {
        let targetAttr;
        switch (contentType) {
            case CONSTANT.CONTENT_TYPE.COMIC:
                targetAttr = { followingComics: contentID };
                break;
            case CONSTANT.CONTENT_TYPE.STORY:
                targetAttr = { followingStories: contentID };
                break;
        }
        let updateAction;
        switch (followActionType) {
            case CONSTANT.FOLLOW_ACTION_TYPE.FOLLOW:
                updateAction = { $addToSet: targetAttr };
                break;
            case CONSTANT.FOLLOW_ACTION_TYPE.UNFOLLOW:
                updateAction = { $pull: targetAttr }
                break;
        }
        return UserService.updateUser(
            { _id: userID },
            updateAction,
            { lean: false, new: true }
        )
    },

    voteOnContent: async (userID, contentID, contentType, prev, current) => {
        const updateAction = getUserVoteAction(contentType, '', prev, current, contentID);
        return UserService.updateUser(
            { _id: userID },
            updateAction,
            { lean: false, new: true }
        )
    },

    voteOnSubcontent: async (userID, contentID, subcontentType, prev, current) => {
        const updateAction = getUserVoteAction('', subcontentType, prev, current, contentID);
        return UserService.updateUser(
            { _id: userID },
            updateAction,
            { lean: false, new: true }
        )
    },

    /**
     * 
     * @param {String} nameOrEmail 
     * @param {Strring[]} answers 
     */

    validateAnswers: (userAnswers, answers) => {
        try {
            return userAnswers.every((ans, i) => {
                return bcrypt.compareSync(answers[i], ans);   
            })
        } catch (e) {
            throw e;
        }
    },

    changePassword: async (userID, password) => {
        try {
            const hashedPwd = await bcrypt.hash(password, env.SALT_FACTOR);
            const user = await UserService.updateUser(
                { _id: userID },
                { password: hashedPwd },
                { lean: true, new: true }
            )
            if (!user) {
                throw new Error("The user does not exist");
            }
            return omit(user, ['password', 'answers']);
        } catch (e) {
            throw e;
        }
    },

    isUserAdmin: async (userID) => {
        try {
            const user = await UserService.findUser({ _id: userID });
            if (!user) {
                throw new Error("The user does not exist");
            }
            return user.isAdmin;
        } catch (e) {
            throw e;
        }
    },

    isUserFollowingUser: async (userID, followingUserID) => {
        return UserService.findUser(
            { _id: userID, followers: followingUserID }
        );
    },

    isUserFollowingContent: async (contentType, contentID, userID) => {
        if (contentType === CONSTANT.CONTENT_TYPE.COMIC) {
            return UserService.findUser(
                { _id: userID, followingComics: contentID }
            );
        } else {
            return UserService.findUser(
                { _id: userID, followingStories: contentID }
            );
        }
    },

    /**
     * 
     * @param { CONSTANT.CONTENT_TYPE & CONSTANT.SUBCONTENT_TYPE } contentType 
     * @param  {{ text: String, contentID: String }} notification 
     */

    addNotificationToFollowers: async (contentType, contentID, followers, ...notifications) => {
        let updateAction, filter;
        if (contentType === CONSTANT.CONTENT_TYPE.COMIC || contentType === CONSTANT.SUBCONTENT_TYPE.PAGE) {
            filter = {
                $or: [
                    { followingComics: contentID },
                    { _id: { $in: followers } }
                ]
            };
            updateAction = { $push: { comicNotifications: { $each: notifications } } }
        } else {
            filter = {
                $or: [
                    { followingStories: contentID },
                    { _id: { $in: followers } }
                ]
            };
            updateAction = { $push: { storyNotifications: { $each: notifications } } }
        }
        return UserService.updateManyUser(
            filter,
            updateAction,
            { lean: true, new: true }
        )
    },

    addNotificationToUser: async (contentType, userID, notification) => {
        let updateAction;
        if (contentType === CONSTANT.CONTENT_TYPE.COMIC || contentType === CONSTANT.SUBCONTENT_TYPE.PAGE) {
            updateAction = { $push: { comicNotifications: notification } };
        } else {
            updateAction = { $push: { storyNotifications: notification } };
        }
        return UserService.updateUser(
            { _id: userID },
            updateAction
        )
    },

    addUserContent: async (contentType, userID, contentID) => {
        if (contentType === CONSTANT.CONTENT_TYPE.COMIC) {
            return UserService.updateUser(
                { _id: userID },
                { $addToSet: { ownComics: contentID } },
                { lean: false, new: true }
            )
        } else {
            return UserService.updateUser(
                { _id: userID },
                { $addToSet: { ownStories: contentID } }, 
                { lean: false, new: true }
            )
        }
    },

    changeUserDescription: async (userID, description) => {
        return UserModel.findOneAndUpdate(
            { _id: userID },
            { description: description },
            { lean: false, new: true }
        )
    },

    populateUser: async (user) => {
        await user
        .populate({
            path: 'ownComics',
            select: '-comments -contentList'
        });

        await user
        .populate({
            path: 'ownStories',
            select: '-comments -contentList'
        });

        return user;
    }





}






module.exports = UserService