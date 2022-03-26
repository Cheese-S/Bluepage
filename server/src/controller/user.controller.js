const UserService = require('../service/user.service')
const { omit } = require('lodash')
const auth = require('../auth')
const CONSTANT = require('../constant')
const path = require('path');
const ContentService = require('../service/content.service');

const UserController = {
    registerUser: async (req, res, next) => {
        try {
            const existingUser = await UserService.findUser({
                $or: [{ name: req.body.name }, { email: req.body.email }]
            })
            if (existingUser) {
                return res.status(409).send({
                    error: `Your ${req.body.name === existingUser.name ? 'username' : 'email'} has already been used. Please use another one.`
                })
            }
            const user = await UserService.createUser({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                answers: req.body.answers
            })
            const token = auth.signToken(user);
            return res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            }).status(200).send({
                user: { ...user, isLoggedIn: true }
            }).send();
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }

    },

    getUser: async (req, res, next) => {
        try {
            const userID = req.locals.userID;
            const user = await UserService.findUser({
                _id: userID
            });
            if (!user) {
                return res.status(500).send({
                    error: "Corrupted Data, the user does not exist"
                })
            }
            return res.status(200).send({
                user: { ...omit(user, [`password`, `answers`]), isLoggedIn: true }
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    followUser: async (req, res, next) => {
        try {
            if (req.locals.userID === req.body.followingUserID) {
                return res.status(400).send({
                    error: "You cannot follow yourself"
                })
            }
            const user = await UserService.followUser(req.locals.userID, req.body.followingUserID, req.body.action);
            return res.status(200).send({
                user: user
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    loginUser: async (req, res) => {
        try {
            const user = await UserService.loginUser(req.body.nameOrEmail, req.body.password);

            const token = auth.signToken(user);
            return res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            }).status(200).send({
                user: { ...user, isLoggedIn: true }
            }).send();
        } catch (e) {
            return res.status(400).send({
                error: e.message
            })
        }
    },

    logoutUser: (req, res) => {
        const token = auth.invalidToken();
        return res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }).status(200).send({
            user: CONSTANT.EMPTY_USER
        }).send();
    },

    followContent: async (req, res) => {
        try {
            const { contentID, contentType, action } = req.body;
            
            const user = await UserService.followContent(req.locals.userID, contentID, contentType, action);

            const content = await ContentService.followContent(contentType, contentID, action);
            if (!content) {
                await UserService.followContent(req.locals.userID, contentID, contentType, CONSTANT.FOLLOW_ACTION_TYPE.invert(action)); 
                return res.status(400).send({
                    error: `The ${contentType === CONSTANT.CONTENT_TYPE.COMIC ? 'comic' : 'story'} does not exist`
                })
            }
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    voteOnContent: async(req, res) => {
        try {
            const { contentID, contentType, prev, current } = req.body;
            if (prev === current) {
                return res.status(400).send({
                    error:'Your current and prev state should not be the same'
                })
            }
            const { userID } = req.locals;
            const user = await UserService.voteOnContent(userID, contentID, contentType, prev, current); 
            const content = await ContentService.voteOnContent(contentType, contentID, prev, current);
            if (!content) {
                await UserService.voteOnContent(userID, contentID, contentType, current, prev); 
                return res.status(400).send({
                    error: `The ${contentType === CONSTANT.CONTENT_TYPE.COMIC ? 'comic' : 'story'} does not exist`
                })
            }
            return res.status(200).send({
                user: omit(user, ["password", "answers"]),
                content: content 
            })
        } catch(e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    changePassword: async (req, res) => {
        if (req.body.isLoggedIn) {
            auth.verify(req, res, async () => {
                try {
                    const { userID } = req.locals;
                    const { password } = req.body;
                    const user = await UserService.findUser({ _id: userID });
                    
                    await UserService.changePassword(userID, password);
                    return res.sendStatus(200);
                } catch (e) {
                    return res.status(400).send({
                        error: e.message
                    })
                }
            })
        } else {
            try {
                const { password, answers, nameOrEmail } = req.body;
                const user = await UserService.findUser({ $or: [{ name: nameOrEmail }, { email: nameOrEmail }] });
                
                const isValid = await UserService.validateAnswers(user.answers, answers);
                if (!isValid) {
                    return res.status(400).send({
                        error: "The answers to the security questions are not correct"
                    })
                }
                await UserService.changePassword(user._id, password);
                return res.sendStatus(200);
            } catch (e) {
                return res.status(500).send({
                    error: e.message
                })
            }
        }
    },

    isUserAdmin: async (req, res, next) => {
        try {
            const { userID } = req.locals; 
            const isUserAdmin = await UserService.isUserAdmin(userID);
            console.log(isUserAdmin);
            if (!isUserAdmin) {
                return res.status(400).send({
                    error: "Unauthorized user"
                })
            }
            next(); 
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    }

}


module.exports = UserController