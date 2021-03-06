const StoryModel = require('../model/story.model')
const ComicModel = require('../model/comic.model')
const CONSTANT = require('../constant')
const fs = require('fs')
const path = require('path')
const { query } = require('express')
const mongoose = require('mongoose');

function getContentVoteAction(prev, current) {
    let doAction, undoAction;
    if (prev === CONSTANT.VOTE_STATE_TYPE.DISLIKE) {
        undoAction = { dislikes: -1 }
    } else if (prev === CONSTANT.VOTE_STATE_TYPE.LIKE) {
        undoAction = { likes: -1 }
    }

    if (current === CONSTANT.VOTE_STATE_TYPE.DISLIKE) {
        doAction = { dislikes: 1 }
    } else if (current === CONSTANT.VOTE_STATE_TYPE.LIKE) {
        doAction = { likes: 1 }
    }
    return {
        $inc: {
            ...doAction,
            ...undoAction
        }
    }
}

const ContentService = {

    getModel: (contentType) => {
        return contentType === CONSTANT.CONTENT_TYPE.COMIC ? ComicModel : StoryModel
    },

    createContent: async (contentType, title, description, userID, name, tags) => {
        try {
            const model = ContentService.getModel(contentType);
            let createObj = {
                title: title,
                description: description,
                author: {
                    id: userID,
                    name: name
                },
                tags: tags,
            }
            const content = await model.create(createObj);
            return content.toJSON();
        } catch (e) {
            throw e;
        }
    },

    findContent: async (contentType, query, option = { lean: true }) => {
        const model = ContentService.getModel(contentType);
        return model.findOne(query, null, option);
    },

    findManyContent: async (contentType, query, option = { lean: true }) => {
        const model = ContentService.getModel(contentType);
        return model.find(query, null, option);
    },

    updateContent: async (contentType, query, update, option = { lean: true, new: true, timestamps: false }) => {
        const model = ContentService.getModel(contentType);
        return model.findOneAndUpdate(query, update, option);
    },

    deleteContent: async (contentType, query) => {
        const model = ContentService.getModel(contentType);
        return model.findOneAndDelete(query);
    },

    deleteContentSubcontent: async (contentType, contentID, subcontentID) => {
        return ContentService.updateContent(contentType,
            { _id: contentID },
            { $pull: { contentList: { subcontent: subcontentID } } },
            { lean: true, new: true }
        )
    },

    addSubcontent: async (contentType, contentID, subcontentID) => {
        return ContentService.updateContent(contentType,
            { _id: contentID },
            { $addToSet: { contentList: { subcontent: subcontentID } } },
            { lean: false, new: true, timestamps: false }
        )
    },

    commentContent: async (contentType, contentID, userID, name, text) => {
        return ContentService.updateContent(contentType,
            { _id: contentID, published: true },
            {
                $push: {
                    comments: {
                        user: {
                            id: userID,
                            name: name
                        },
                        text: text
                    },
                }
            },
            { lean: false, new: true, timestamps: false }
        )
    },

    subcommentContent: async (contentType, contentID, commentID, userID, name, text) => {
        return ContentService.updateContent(contentType,
            {
                _id: contentID,
                comments: {
                    $elemMatch: {
                        _id: commentID
                    }
                },
                published: true
            },
            {
                $push: {
                    "comments.$[comment].subcomments": {
                        user: {
                            id: userID,
                            name: name
                        },
                        text: text
                    }
                }
            },
            {
                lean: false,
                new: true,
                arrayFilters: [{ "comment._id": commentID }]
            }
        )
    },

    setContentThumbnail: async (contentType, id, filePath) => {
        try {
            let encodedThumbnail = fs.readFileSync(filePath);
            encodedThumbnail = encodedThumbnail.toString('base64');
            return ContentService.updateContent(contentType,
                { _id: id },
                { thumbnail: Buffer.from(encodedThumbnail, 'base64') },
                { lean: false, new: true }
            )
        } catch (e) {
            throw e;
        }
    },

    followContent: async (contentType, contentID, followAction) => {
        return ContentService.updateContent(contentType,
            { _id: contentID, published: true },
            { $inc: { followers: followAction === CONSTANT.FOLLOW_ACTION_TYPE.FOLLOW ? 1 : -1 } },
            { lean: false, new: true, timestamps: false }
        )
    },

    voteOnContent: async (contentType, contentID, prev, current) => {
        const updateAction = getContentVoteAction(prev, current);
        return ContentService.updateContent(contentType,
            { _id: contentID, published: true },
            updateAction,
            { lean: false, new: true, timestamps: false }
        );
    },

    viewContent: async (contentType, contentID) => {
        return ContentService.updateContent(contentType,
            { _id: contentID, published: true },
            { $inc: { views: 1 } },
            { lean: false, new: true, timestamps: false }
        )
    },

    takeOffContent: async (contentType, contentID) => {
        return ContentService.updateContent(contentType,
            { _id: contentID, published: true },
            { published: false },
            { lean: false, new: true, timestamps: false }
        )
    },

    getPaginatedContent: async (contentType, queryOption, paginateOption) => {
        const model = ContentService.getModel(contentType);
        console.log("CONTENT TYPE: ", contentType);
        console.log("paginate option:", paginateOption);
        console.log("query option", queryOption);
        const {title} = queryOption;
        const authorName = queryOption['author.name']; 
        if (title) {
            queryOption.title = new RegExp(title, 'i');
        }
        if (authorName) {
            queryOption['author.name'] = new RegExp(authorName, 'i');
        }
        return model.paginate(queryOption, paginateOption, (err, result) => {
            if (err) {
                throw err;
            }
            console.log(result);
            return result;
        })
    },

    isOwnedByUser: async (contentType, contentID, userID) => {
        return ContentService.findContent(contentType,
            {
                _id: mongoose.Types.ObjectId(contentID),
                "author.id": userID
            }
        )
    },

    isContentPublished: async (contentType, contentID) => {
        return ContentService.findContent(contentType,
            {
                _id: contentID,
                published: true
            }
        )
    }

}

module.exports = ContentService