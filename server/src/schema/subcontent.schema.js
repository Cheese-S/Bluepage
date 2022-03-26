const Joi = require('joi');
const CONSTANT = require('../constant')

const createSubcontentSchema = Joi.object({
    parentID: Joi.string().length(24).messages({
        'string.length': 'contentID must be a valid ObjectID'
    }),
    contentType: Joi.string().valid(CONSTANT.SUBCONTENT_TYPE.CHAPTER, CONSTANT.SUBCONTENT_TYPE.PAGE).required(),
    title: Joi.string().required()
});

const commentSubcontentSchema = Joi.object({
    action: Joi.string().valid(
        CONSTANT.COMMENT_ACTION_TYPE.COMMENT,
        CONSTANT.COMMENT_ACTION_TYPE.SUBCOMMENT
    ).required(),
    commentID: Joi.string().length(24).when('action', {is: CONSTANT.COMMENT_ACTION_TYPE.SUBCOMMENT, then: Joi.required()}),
    comment: Joi.string().required(),
    contentType: Joi.string().valid(CONSTANT.SUBCONTENT_TYPE.CHAPTER, CONSTANT.SUBCONTENT_TYPE.PAGE).required(),
});

const voteOnSubcontentSchema = Joi.object({
    action: Joi.string().valid(
        CONSTANT.VOTE_ACTION_TYPE.LIKE,
        CONSTANT.VOTE_ACTION_TYPE.DISLIKE,
        CONSTANT.VOTE_ACTION_TYPE.CANCEL
    ).required(),
    contentID: Joi.string().length(24).required(),
    contentType: Joi.string().valid(CONSTANT.SUBCONTENT_TYPE.CHAPTER, CONSTANT.SUBCONTENT_TYPE.PAGE).required(),
});

const viewSubcontentSchema = Joi.object({
    contentID: Joi.string().length(24).required(),
    contentType: Joi.string().valid(CONSTANT.SUBCONTENT_TYPE.CHAPTER, CONSTANT.SUBCONTENT_TYPE.PAGE).required(),
})


const updateSubcontentSchema = Joi.object({
    title: Joi.string().required(),
    published: Joi.boolean().required(),
    editorContent: Joi.object().required(), 
    contentID: Joi.string().length(24).required(),
    contentType: Joi.string().valid(CONSTANT.SUBCONTENT_TYPE.CHAPTER, CONSTANT.SUBCONTENT_TYPE.PAGE).required(),
});

const takeOffSubcontentSchema = viewSubcontentSchema;

module.exports = {
    takeOffSubcontentSchema,
    updateSubcontentSchema,
    voteOnSubcontentSchema,
    commentSubcontentSchema,
    createSubcontentSchema
}