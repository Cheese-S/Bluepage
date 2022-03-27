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

    updateContent: async (contentType, query, update, option = { lean: true, new: true }) => {
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
            { $pull: { contentList: { id: subcontentID } } }
        )
    },

    addSubcontent: async (contentType, contentID, subcontentID, subcontentTitle) => {
        return ContentService.updateContent(contentType,
            { _id: contentID },
            { $addToSet: { contentList: { id: subcontentID, title: subcontentTitle } } }
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
            }
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
                lean: true,
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
                { thumbnail: Buffer.from(encodedThumbnail, 'base64') }
            )
        } catch (e) {
            throw e;
        }
    },

    followContent: async (contentType, contentID) => {
        return ContentService.updateContent(contentType,
            { _id: contentID, published: true },
            { $inc: { followers: 1 } }
        )
    },

    voteOnContent: async (contentType, contentID, prev, current) => {
        const updateAction = getContentVoteAction(prev, current);
        return ContentService.updateContent(contentType,
            { _id: contentID, published: true },
            updateAction
        );
    },

    viewContent: async (contentType, contentID) => {
        return ContentService.updateContent(contentType,
            { _id: contentID, published: true },
            { $inc: { views: 1 } }
        )
    },

    takeOffContent: async (contentType, contentID) => {
        return ContentService.updateContent(contentType,
            { _id: contentID, published: true },
            { published: false }
        )
    },

    getPaginatedContent: async (contentType, queryOption, pagianteOption) => {
        const model = ContentService.getModel(contentType);
        return model.paginate(queryOption, pagianteOption, (err, result) => {
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