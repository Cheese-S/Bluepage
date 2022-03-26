const ContentService = require('../service/content.service')
const CONSTANT = require('../constant')
const { PaginationParameters } = require('mongoose-paginate-v2');
const fs = require('fs');

const ContentController = {

    createContent: async (req, res, next) => {
        try {
            const { contentType, title, description, tags } = req.body;
            const { userID, name } = req.locals;
            const content = await ContentService.createContent(contentType, title, description, userID, name, tags);
            return res.status(200).send({
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
                    error: `Unauthorized User`
                })
            }
            const content = await ContentService.setContentThumbnail(contentType, contentID, req.file.path);
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} does not exist`
                })
            }
            return res.status(200).send({
                content: content
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
                    error: `The ${contentType} does not exist or it is not published yet`
                })
            }
            return res.status(200).send({
                content: content
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
                { _id: contentID }
            )
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} does not exist`
                })
            }
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    getContents: (req, res) => {
        try {
            const { query, contentType } = req.body;
            const result = ContentService.getPaginatedContent(contentType, query, ...new PaginationParameters(req).get());
            return res.status(400).send({
                result: result
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    updateContent: async (req, res) => {
        try {
            const { title, description, tags, published, contentID, contentType } = req.body;
            const { userID } = req.locals;
            const isOwnedByUser = await ContentService.isOwnedByUser(contentType, contentID, userID)
            if (!isOwnedByUser) {
                return res.status(400).send({
                    error: `Unauthorized User`
                })
            }
            const content = await ContentService.updateContent(contentType,
                { _id: contentID, published: false },
                {
                    title: title,
                    description: description,
                    tags: tags,
                    published: published,
                }
            )
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} either does not exist or the ${contentType} is already published`
                })
            }
            return res.status(200).send({
                content: content
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
                    error: `The ${contentType} does not exist`
                })
            }
            return res.status(200).send({
                content: content
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },

    takeOffContent: async (req, res) => {
        try {
            const { contentType, contentID } = req.body;
            const content = await ContentService.takeOffContent(contentType, contentID);
            if (!content) {
                return res.status(400).send({
                    error: `The ${contentType} does not exist or it is not published`
                })
            }
            return res.status(200).send({
                content: content
            })
        } catch (e) {
            return res.status(500).send({
                error: e.message
            })
        }
    },
}

module.exports = ContentController