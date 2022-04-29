const ContentService = require('../service/content.service')
const UserService = require('../service/user.service')
const CONSTANT = require('../constant')
const { PaginationParameters } = require('mongoose-paginate-v2');
const fs = require('fs');
const SubcontentService = require('../service/subcontent.service');
const auth = require('../auth');
const { omit } = require('lodash')
const mongoose = require('mongoose')

const ContentController = {

    createContent: async (req, res, next) => {
        try {
            const { contentType, title, description, tags } = req.body;
            const { userID, name } = req.locals;
            const content = await ContentService.createContent(contentType, title, description, userID, name, tags);
            const user = await UserService.addUserContent(contentType, userID, content._id);
            await UserService.populateUser(user);
            return res.status(200).send({
                user: { ...omit(user.toJSON(), ['password', 'answers']), isLoggedIn: true },
                content: content
            });
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    setContentThumbnail: async (req, res, next) => {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).send({
                    error: "No thumbnail is uploaded"
                })
            }
            const { contentID, contentType } = req.body;
            const { userID } = req.locals;
            const isOwnedByUser = await ContentService.isOwnedByUser(contentType, contentID, userID)
            if (!isOwnedByUser) {
                return res.status(400).send({
                    error: `No ${contentType} with this id is owned by you`
                })
            }
            const content = await ContentService.setContentThumbnail(contentType, contentID, req.file.path);


            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} does not exist`
                })
            }
            return res.status(200).send({
                content: await content.populate('contentList.subcontent', ['published', 'title'], { lean: true })
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    commentContent: async (req, res, next) => {
        try {
            const { action, contentID, contentType, comment, commentID } = req.body;
            const { userID, name } = req.locals;
            let content;
            if (action === CONSTANT.COMMENT_ACTION_TYPE.COMMENT) {
                content = await ContentService.commentContent(contentType, contentID, userID, name, comment)
            } else {
                content = await ContentService.subcommentContent(contentType, contentID, commentID, userID, name, comment)
            }
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType}/comment does not exist or it is not published yet`
                })
            }
            return res.status(200).send({
                content: await content.populate('contentList.subcontent', ['published', 'title'], { lean: true })
            });
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    getContentByID: async (req, res) => {
        try {
            const { contentID, contentType } = req.body;
            const content = await ContentService.findContent(contentType,
                { _id: contentID },
                { lean: false }
            )
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} does not exist`
                })
            }

            if (!content.published) {
                req.locals = { ...req.locals, content: content };
                await auth.verify(req, res, async () => {
                    const { userID, content } = req.locals;

                    if (userID !== content.author.id.toString()) {
                        return res.status(400).send({
                            error: "Unauthorized"
                        })
                    } else {
                        return res.status(200).send({
                            content: await content.populate('contentList.subcontent', ['published', 'title'], { lean: true })
                        })
                    }
                })
            } else {
                return res.status(200).send({
                    content: await content.populate('contentList.subcontent', ['published', 'title'], { lean: true })
                })

            }
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    getContents: async (req, res) => {
        try {
            const { query, contentType } = req.body;
            if (!query.published) {
                await auth.verify(req, res, async () => {
                    const { userID } = req.locals;
                    if (userID) {
                        const newQuery = { ...query, "author.id": userID };
                        const result = await ContentService.getPaginatedContent(contentType, newQuery, req.query);
                        return res.status(200).send({
                            result: result
                        })
                    }
                });

            } else {
                const result = await ContentService.getPaginatedContent(contentType, query, req.query);
                return res.status(200).send({
                    result: result
                })
            }
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                error: e.message
            })
        }
    },

    updateContent: async (req, res) => {
        try {
            const { title, description, tags, published, contentID, contentType, subcontentIDs } = req.body;
            const { userID, name, user } = req.locals;
            const isOwnedByUser = await ContentService.isOwnedByUser(contentType, contentID, userID)
            if (!isOwnedByUser) {
                return res.status(400).send({
                    error: `No ${contentType} with this ID is owned by this user`
                })
            }

            const content = await ContentService.updateContent(contentType,
                { _id: contentID, published: false },
                {
                    title: title,
                    description: description,
                    tags: tags,
                    published: published,
                },
                { lean: false, new: true }
            )
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} either does not exist or the ${contentType} is already published`
                })
            }

            if (published) {
                const subcontentType = CONSTANT.CONTENT_TYPE.getSubcontentType(contentType);
                const result = await SubcontentService.publishSubcontents(subcontentType, userID, contentID, subcontentIDs);
                if (!result.modifiedCount) {
                    await ContentService.updateContent(contentType,
                        { _id: contentID },
                        { published: false },
                        { lean: true, new: true, timestamps: true }
                    );
                    return res.status(400).send({
                        error: `These subcontentIDs are not valid ids because one of the following reasons:
                            1. subcontent already published
                            2. doesn't belong to the user
                            3. doesn't belong to this content
                            4. subcontents does not exist
                            5. subcontent's type does not agree with content's type 
                        `
                    })
                } else {
                    await UserService.addNotificationToFollowers(contentType, contentID, userID, user.followers,
                        { text: `${name} has just published a new ${contentType}. Check it out!`, link: contentID }
                    )
                }
            }

            return res.status(200).send({
                content: await content.populate('contentList.subcontent', ['published', 'title'], { lean: true })
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    viewContent: async (req, res) => {
        try {
            const { contentType, contentID } = req.body;
            const content = await ContentService.viewContent(contentType, contentID);
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} either does not exist or is not published`
                })
            }
            return res.status(200).send({
                content: await content.populate('contentList.subcontent', ['published', 'title'], { lean: true })
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    takeOffContent: async (req, res) => {
        try {
            console.log("aa");
            const { contentType, contentID } = req.body;
            const content = await ContentService.takeOffContent(contentType, contentID);
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} does not exist or it is not published`
                })
            }
            const subcontentType = CONSTANT.CONTENT_TYPE.getSubcontentType(contentType);
            const subcontentIDs = content.toJSON().contentList.map(e => e.subcontent);
            console.log(mongoose.Types.ObjectId.isValid(subcontentIDs[0]));
            await SubcontentService.takeOffSubcontents(subcontentType, subcontentIDs);

            await UserService.addNotificationToUser(
                contentType,
                content.author.id,
                {
                    text: `Your ${contentType} "${content.title}" has been taken down because it has been deemed inappropriate for our website.`,
                    link: content._id
                }
            )

            return res.status(200).send({
                content: await content.populate('contentList.subcontent', ['published', 'title'], { lean: true })
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    deleteContent: async (req, res) => {
        try {
            const { contentType, contentID } = req.body;
            const { userID } = req.locals;
            const isOwnedByUser = await ContentService.isOwnedByUser(contentType, contentID, userID)

            if (!isOwnedByUser) {
                return res.status(400).send({
                    error: `No ${contentType} with this ID is owned by you`
                })
            }
            const content = await ContentService.deleteContent(contentType, {_id: contentID});
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} does not exist`
                })
            }
            const subcontentIDs = content.contentList.map((e) => e.id);
            await SubcontentService.deleteManySubcontents(CONSTANT.CONTENT_TYPE.getSubcontentType(contentType), { _id: { $in: subcontentIDs } });
            const user = await UserService.deleteUserContent(contentType, contentID, userID);
            await UserService.populateUser(user);
            if (contentType === CONSTANT.CONTENT_TYPE.COMIC) {
                await UserService.updateManyUser(
                    { followingComics: content._id },
                    { $pull: { followingComics: content._id } }
                )
            } else {
                await UserService.updateManyUser(
                    { followingStories: content._id },
                    { $pull: { followingStories: content._id } }
                )
            }
            return res.status(200).send({
                content: content,
                user: { ...omit(user, ['password', 'answers']), isLoggedIn: true }
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    }
}

module.exports = ContentController