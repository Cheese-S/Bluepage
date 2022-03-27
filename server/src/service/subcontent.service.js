const ChapterModel = require('../model/chapter.model')
const PageModel = require('../model/page.model')
const CONSTANT = require('../constant')

function getSubcontentVoteAction(prev, current) {
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

const SubcontentService = {

    getModel: (subcontentType) => {
        return subcontentType === CONSTANT.SUBCONTENT_TYPE.PAGE ? PageModel : ChapterModel
    },

    createSubcontent: async (subcontentType, parentID, title, body, userID, name) => {
        try {
            const model = SubcontentService.getModel(subcontentType);
            let createObj = {
                parentID: parentID,
                title: title,
                author: {
                    id: userID,
                    name: name
                },
                body: body
            }
            const subcontent = await model.create(createObj);
            return subcontent.toJSON();
        } catch (e) {
            throw e;
        }
    },

    findSubcontent: async (subcontentType, query, option = { lean: true }) => {
        const model = SubcontentService.getModel(subcontentType);
        return model.findOne(query, null, option);
    },

    updateSubcontent: async (subcontentType, query, update, option = { lean: true, new: true }) => {
        const model = SubcontentService.getModel(subcontentType);
        return model.findOneAndUpdate(query, update, option);
    },

    updateManySubcontents: async (subcontentType, filter, update, option = { lean: true, new: true }) => {
        const model = SubcontentService.getModel(subcontentType);
        return model.updateMany(filter, update, option);
    },

    deleteSubcontent: async (subcontentType, query) => {
        const model = SubcontentService.getModel(subcontentType);
        return model.findOneAndDelete(query);
    },

    deleteManySubcontents: async (subcontentType, query) => {
        const model = SubcontentService.getModel(subcontentType);
        return model.deleteMany(query);
    },

    commentSubcontent: async (subcontentType, subcontentID, userID, name, text) => {
        return SubcontentService.updateSubcontent(subcontentType,
            { _id: subcontentID, published: true },
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

    subcommentSubcontent: async (subcontentType, subcontentID, commentID, userID, name, text) => {
        return SubcontentService.updateSubcontent(subcontentType,
            {
                _id: subcontentID,
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

    voteOnSubcontent: async (subcontentType, subcontentID, prev, current) => {
        const updateAction = getSubcontentVoteAction(prev, current);
        return SubcontentService.updateSubcontent(subcontentType,
            { _id: subcontentID, published: true },
            updateAction
        );
    },

    viewSubcontent: async (subcontentType, subcontentID) => {
        return SubcontentService.updateSubcontent(subcontentType,
            { _id: subcontentID, published: true },
            { $inc: { views: 1 } }
        )
    },

    takeOffSubcontent: async (subcontentType, subcontentID) => {
        return SubcontentService.updateSubcontent(subcontentType,
            { _id: subcontentID, published: true },
            { published: false }
        )
    },

    isOwnedByUser: async (subcontentType, subcontentID, userID) => {
        return SubcontentService.findSubcontent(subcontentType,
            {
                _id: subcontentID,
                "author.id": userID
            }
        )
    },

    isSubcontentOwnedByUser: async (subcontentType, subcontentIDs, userID) => {
        const model = SubcontentService.getModel(subcontentType);
        const count = await model.aggregate([
            {
                $match:
                {
                    "_id": { $in: subcontentIDs },
                    "author.id": userID
                },
            },
            { $project: { _id: 1 } },
            { $group: { _id: "_id", count: { $sum: 1 } } },
        ]);
        return count.count === subcontentIDs.length;
    },

    publishSubcontents: async (subcontentType, userID, contentID, ...subcontentIDs) => {
        return SubcontentService.updateManySubcontents(subcontentType,
            { 
                _id: { $in: subcontentIDs } ,
                "author.id": userID,
                published: false,
                parentID: contentID
            },
            { published: true }
        )
    },

    takeOffSubcontents: async (subcontentType, ...subcontentIDs) => {
        return SubcontentService.updateManySubcontents(subcontentType,
            { _id: { $in: subcontentIDs } },
            { published: false }
        )
    }

}

module.exports = SubcontentService