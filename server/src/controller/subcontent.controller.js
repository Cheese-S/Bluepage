const UserService = require('../service/user.service')
const CONSTANT = require('../constant')
const { PaginationParameters } = require('mongoose-paginate-v2');
const SubcontentService = require('../service/subcontent.service');
const ContentService = require('../service/content.service');
const auth = require('../auth')

const SubcontentController = {

    createSubcontent: async (req, res, next) => {
        try {
            const { parentID, subcontentType, title, body } = req.body;
            const { userID, name } = req.locals;
            const contentType = CONSTANT.SUBCONTENT_TYPE.getContentType(subcontentType);
            if (!CONSTANT.CONTENT_TYPE.doTypesAgree(subcontentType, contentType)) {
                return res.status(400).send({
                    error: `You cannot create a ${subcontentType} for a ${contentType}.`
                })
            }
            const isContentOwnedByUser = await ContentService.isOwnedByUser(contentType, parentID, userID);
            if (!isContentOwnedByUser) {
                return res.status(400).send({
                    error: `You cannot create a ${subcontentType} for a ${contentType} you don't own.`
                })
            }
            const subcontent = await SubcontentService.createSubcontent(subcontentType, parentID, title, body, userID, name);
            const content = await ContentService.addSubcontent(contentType, parentID, subcontent._id);
            return res.status(200).send({
                content: await content.populate('contentList.subcontent', ['published', 'title'], {lean: true}),
                subcontent: subcontent
            });
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    commentSubcontent: async (req, res, next) => {
        try {
            const { action, subcontentID, subcontentType, comment, commentID } = req.body;
            const { userID, name } = req.locals;
            let subcontent;
            if (action === CONSTANT.COMMENT_ACTION_TYPE.COMMENT) {
                subcontent = await SubcontentService.commentSubcontent(subcontentType, subcontentID, userID, name, comment)
            } else {
                subcontent = await SubcontentService.subcommentSubcontent(subcontentType, subcontentID, commentID, userID, name, comment)
            }
            if (!subcontent) {
                return res.status(400).send({
                    error: `The ${subcontentType} does not exist or it is not published yet`
                })
            }
            return res.status(200).send({
                subcontent: subcontent
            });
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    getSubcontentByID: async (req, res) => {
        try {
            const { subcontentID, subcontentType } = req.body;
            const subcontent = await SubcontentService.findSubcontent(subcontentType,
                { _id: subcontentID }
            )
            if (!subcontent) {
                return res.status(400).send({
                    error: `The ${subcontentType} does not exist`
                })
            }
            if (!subcontent.published) {
                req.locals = { ...req.locals, subcontent: subcontent };
                await verify(req, res, () => {
                    const { userID, subcontent } = req.locals;
                    if (userID !== subcontent.author.id.toString()) {
                        return res.status(400).send({
                            error: "Unauthorized"
                        })
                    } else {
                        return res.status(200).send({
                            subcontent: subcontent
                        })
                    }
                })
            } else {
                return res.status(200).send({
                    subcontent: subcontent
                })
            }

        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    updateSubcontent: async (req, res) => {
        try {
            const { subcontentID, subcontentType, title, published, body, parentID } = req.body;
            const { userID } = req.locals;
            const isOwnedByUser = await SubcontentService.isOwnedByUser(subcontentType, subcontentID, userID)
            if (!isOwnedByUser) {
                return res.status(400).send({
                    error: `No ${subcontentType} is owned by this user`
                })
            }

            if (isOwnedByUser.published) {
                return res.status(400).send({
                    error: `You cannot edit a published ${subcontentType}`
                })
            }

            const contentType = CONSTANT.SUBCONTENT_TYPE.getContentType(subcontentType);
            const content = await ContentService.findContent(contentType,
                { _id: parentID },
            )

            if (!content.published && published) {
                return res.status(400).send({
                    error: `You cannot publish ${subcontentType} for a unpublished ${contentType}`
                })
            }

            const subcontent = await SubcontentService.updateSubcontent(subcontentType,
                { _id: subcontentID, published: false },
                {
                    title: title,
                    body: body,
                    published: published,
                }
            )

            if (!subcontent) {
                return res.status(400).send({
                    error: `The ${subcontentType} either does not exist or the ${subcontentType} is already published`
                })
            }

            if (published) {
                await UserService.addNotificationToFollowers(subcontentType, content._id,
                    { text: `A new ${subcontentType} has been published ${contentType} ${content.title} is updated` }
                )
            }

            return res.status(200).send({
                subcontent: subcontent
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    viewSubcontent: async (req, res) => {
        try {
            const { subcontentType, subcontentID } = req.body;
            const subcontent = await SubcontentService.viewSubcontent(subcontentType, subcontentID);
            console.log(subcontentType, subcontentID);
            if (!subcontent) {
                return res.status(400).send({
                    error: `The ${subcontentType} does not exist`
                })
            }
            return res.status(200).send({
                subcontent: subcontent
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    takeOffSubcontent: async (req, res) => {
        try {
            const { subcontentType, subcontentID } = req.body;
            const subcontent = await SubcontentService.takeOffSubcontent(subcontentType, subcontentID);
            if (!subcontent) {
                return res.status(400).send({
                    error: `The ${subcontentType} does not exist or it is not published`
                })
            }

            await UserService.addNotificationToUser(
                subcontentType,
                content.author.id,
                {
                    text: `Your ${contentType} "${subcontent.title}" has been taken down because it has been deemed inappropriate for our website.`,
                    link: subcontent._id
                }
            )

            return res.status(200).send({
                subcontent: subcontent
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    deleteSubcontent: async (req, res) => {
        try {
            const { subcontentType, subcontentID } = req.body;
            const { userID } = req.locals;
            const isOwnedByUser = await SubcontentService.isOwnedByUser(subcontentType, subcontentID, userID)
            if (!isOwnedByUser) {
                return res.status(400).send({
                    error: `Unauthorized User`
                })
            }
            const subcontent = await SubcontentService.deleteSubcontent(subcontentType, subcontentID);
            if (!subcontent) {
                return res.status(400).send({
                    error: `The ${subcontentType} does not exist`
                })
            }
            const contentType = CONSTANT.SUBCONTENT_TYPE.getContentType(subcontentType);
            const content = await ContentService.deleteContentSubcontent(contentType, subcontent.parentID, subcontent.id);
            return res.status(200).send({
                content: content,
                subcontent: subcontent
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    publishSubcontents: async (req, res) => {
        try {
            const { subcontentType, subcontentIDs, parentID } = req.body;
            const { userID, user } = req.locals;
            const contentType = CONSTANT.SUBCONTENT_TYPE.getContentType(subcontentType);
            const content = await ContentService.findContent(contentType,
                { _id: parentID }
            )
            if (!content.published) {
                return res.status(400).send({
                    error: `You cannot publish ${subcontentType} for a unpublished ${contentType}`
                })
            }

            const result = await SubcontentService.publishSubcontents(subcontentType, userID, parentID, subcontentIDs);
            if (result.modifiedCount) {
                await UserService.addNotificationToFollowers(subcontentType, content._id, user.followers,
                    { text: `New ${subcontentType} has been published for the ${contentType} "${content.title}".` }
                )
                return res.sendStatus(200);
            } else {
                return res.status(400).send({
                    error: `Your request has failed for one of the following reasons:
                        1. Subcontents do not belong to you.
                        2. Subcontent do not belong to this parentID.
                        3. Subcontent type doe not agree with content type.
                        4. Subcontens have already been published
                    `
                })
            }
            

        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    }
}

module.exports = SubcontentController