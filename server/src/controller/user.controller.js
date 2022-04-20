const UserService = require('../service/user.service')
const { omit } = require('lodash')
const auth = require('../auth')
const CONSTANT = require('../constant')
const path = require('path');
const ContentService = require('../service/content.service');
const SubcontentService = require('../service/subcontent.service');
const { default: mongoose } = require('mongoose');


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
                httpOnly: true
            }).status(200).send({
                user: omit({ ...user.toJSON(), isLoggedIn: true }, ['password', 'answers'])
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
            const user = await UserService.getUser(userID, false);

            return res.status(200).send({
                user: { ...omit(user.toJSON(), ['password', 'answers']), isLoggedIn: true }
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    getUserByID: async (req, res, next) => {
        try {
            const userID = req.params.id
            let user = await UserService.getUser(userID, true);
            if (!user) {
                return res.status(400).send({
                    error: "Could not find this user."
                })
            }

            return res.status(200).send({
                user: { ...omit(user.toJSON(), ['password', 'answers', 'comicNotifications', 'storyNotifications', 'isAdmin']) }
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
            const followingUser = await UserService.findUser(
                { _id: req.body.followingUserID }
            );
            if (!followingUser) {
                return res.status(400).send({
                    error: "The user you are trying to follow does not exist"
                })
            }
            const user = await UserService.followUser(req.locals.userID, req.body.followingUserID, req.body.action);
            await UserService.populateUser(user);
            return res.status(200).send({
                user: omit(user.toJSON(), ['password', 'answers'])
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
            await UserService.populateUser(user);
            const token = auth.signToken(user);
            return res.cookie("token", token, {
                httpOnly: true
            }).status(200).send({
                user: { ...omit(user.toJSON(), ['password', 'answers']), isLoggedIn: true }
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
            httpOnly: true
        }).status(200).send({
            user: CONSTANT.EMPTY_USER
        }).send();
    },

    followContent: async (req, res) => {
        try {
            const { contentID, contentType, action } = req.body;
            const { userID } = req.locals;

            const isUserFollowing = await UserService.isUserFollowingContent(contentType, contentID, userID);

            if (isUserFollowing && action === CONSTANT.FOLLOW_ACTION_TYPE.FOLLOW) {
                return res.status(400).send({
                    error: 'You cannot follow a user that you are already following'
                })
            }

            if (!isUserFollowing && action === CONSTANT.FOLLOW_ACTION_TYPE.UNFOLLOW) {
                return res.status(400).send({
                    error: 'You cannot unfollow a user that you are not already following'
                })
            }

            const content = await ContentService.followContent(contentType, contentID, action);
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} might not exist or might not be published yet`
                })
            }

            const user = await UserService.followContent(userID, contentID, contentType, action);
            await UserService.populateUser(user);
            return res.status(200).send({
                user: omit(user.toJSON(), ['password', 'answers']),
                content: content
            })

        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    voteOnContent: async (req, res) => {
        try {
            const { contentID, contentType, prev, current } = req.body;
            if (prev === current) {
                return res.status(400).send({
                    error: 'Your current and prev state should not be the same'
                })
            }
            const { userID } = req.locals;
            const content = await ContentService.voteOnContent(contentType, contentID, prev, current);
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} might not exist or might not be published yet`
                })
            }
            const user = await UserService.voteOnContent(userID, contentID, contentType, prev, current);
            await UserService.populateUser(user);
            return res.status(200).send({
                user: omit(user.toJSON(), ["password", "answers"]),
                content: content
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    voteOnSubcontent: async (req, res) => {
        try {
            const { subcontentID, subcontentType, prev, current } = req.body;
            if (prev === current) {
                return res.status(400).send({
                    error: 'Your current and prev state should not be the same'
                })
            }
            const { userID } = req.locals;
            const subcontent = await SubcontentService.voteOnSubcontent(subcontentType, subcontentID, prev, current);
            if (!subcontent) {
                return res.status(400).send({
                    error: `The ${subcontentType} might not exist or might not be published yet`
                })
            }
            const user = await UserService.voteOnSubcontent(userID, subcontentID, subcontentType, prev, current);

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

            return res.status(200).send({
                user: omit(user.toJSON(), ["password", "answers"]),
                subcontent: subcontent
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    changePassword: async (req, res) => {
        if (req.body.isLoggedIn) {
            await auth.verify(req, res, async () => {
                try {
                    const { userID } = req.locals;
                    const { password } = req.body;
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
                if (!user) {
                    return res.status(400).send({
                        error: "User does not exist"
                    })
                }
                console.log(user.answers);
                const isValid = UserService.validateAnswers(user.answers, answers);

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

    changeDescription: async (req, res) => {
        try {
            const { description } = req.body;
            const { userID } = req.locals;
            const user = await UserService.changeUserDescription(userID, description);

            await UserService.populateUser(user);

            return res.status(200).send({
                ...omit(user.toJSON(), ['password', 'answers']), isLoggedIn: true
            })
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                error: e.message
            })
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