const UserModel = require('../model/user.model')
const { omit } = require('lodash');
const { logger } = require('bs-logger');
const bcrypt = require('bcrypt');
const env = require('../env.config')
const CONSTANT = require('../constant')




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
        try {
            console.log(input);
            const hashedPwd = await bcrypt.hash(input.password, env.SALT_FACTOR);
            const hashedAnswers = input.answers.map((str) => bcrypt.hashSync(str, env.SALT_FACTOR));

            const user = await UserModel.create({
                name: input.name,
                email: input.email,
                password: hashedPwd,
                answers: hashedAnswers,
                isAdmin: false
            });
            return omit(user.toJSON(), ['password', 'answers']);
        } catch (e) {
            logger.error(e);
            throw e;
        }
    },

    findUser: async (query, option = { lean: true }) => {
        return UserModel.findOne(query, null, option);
    },

    updateUser: async (query, update, option) => {
        return UserModel.findOneAndUpdate(query, update, option);
    },

    followUser: async (selfID, userID, action) => {
        try {
            let update = { $addToSet: { followers: selfID } };
            if (action === CONSTANT.FOLLOW_ACTION_TYPE.UNFOLLOW) {
                update = { $pull: { followers: selfID } };
            }
            const user = await UserService.updateUser(
                { _id: userID },
                update,
                { lean: true, new: true }
            )
            if (!user) {
                throw new Error("The user you want to follow does not exist");
            }
            return omit(user, ['password', 'answers'])
        } catch (e) {
            throw e;
        }
    },

    /**
     * Pa
     * @param {String} nameOrEmail 
     * @param {String} pwd 
     */
    loginUser: async (nameOrEmail, pwd) => {
        try {
            const user = await UserService.findUser({ $or: [{ name: nameOrEmail }, { email: nameOrEmail }] });
            if (!user) {
                throw new Error("The user with this email or name does not exist");
            }
            const isValid = await bcrypt.compare(pwd, user.password);
            if (!isValid) {
                throw new Error("The username / email or your password is not correct");
            }
            return omit(user, ['password', 'answers']);
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
            case CONSTANT.FOLLOW_ACTION_TYPE.UNFOLLOW:
                updateAction = { $addToSet: targetAttr }
        }
        return UserService.updateUser(
            { _id: userID },
            updateAction,
            { lean: true, new: true }
        )
    },

    /**
     * 
     * @param {String} nameOrEmail 
     * @param {Strring[]} answers 
     */

    validateAnswers: async (userAnswers, answers) => {
        try {
            return userAnswers.every(async (ans, i) => {
                await bcrypt.compare(ans, answers[i]).catch((e) => false); 
            })
        } catch(e) {
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
        } catch(e) {
            throw e; 
        }
    }

}






module.exports = UserService