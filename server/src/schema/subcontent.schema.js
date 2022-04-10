const Joi = require('joi');
const CONSTANT = require('../constant')

const createSubcontentSchema = Joi.object({
    parentID: Joi.string().length(24).messages({
        'string.length': 'contentID must be a valid ObjectID'
    }),
    subcontentType: Joi.string().valid(CONSTANT.SUBCONTENT_TYPE.CHAPTER, CONSTANT.SUBCONTENT_TYPE.PAGE).required(),
    title: Joi.string().required(),
    body: Joi.object().required()
});

const commentSubcontentSchema = Joi.object({
    action: Joi.string().valid(
        CONSTANT.COMMENT_ACTION_TYPE.COMMENT,
        CONSTANT.COMMENT_ACTION_TYPE.SUBCOMMENT
    ).required(),
    commentID: Joi.string().length(24).when('action', {is: CONSTANT.COMMENT_ACTION_TYPE.SUBCOMMENT, then: Joi.required()}),
    comment: Joi.string().required(),
    subcontentType: Joi.string().valid(CONSTANT.SUBCONTENT_TYPE.CHAPTER, CONSTANT.SUBCONTENT_TYPE.PAGE).required(),
    subcontentID: Joi.string().length(24).required(),
});

const viewSubcontentSchema = Joi.object({
    subcontentID: Joi.string().length(24).required(),
    subcontentType: Joi.string().valid(CONSTANT.SUBCONTENT_TYPE.CHAPTER, CONSTANT.SUBCONTENT_TYPE.PAGE).required(),
})


const updateSubcontentSchema = Joi.object({
    title: Joi.string().required(),
    published: Joi.boolean().required(),
    body: Joi.object().required(), 
    subcontentID: Joi.string().length(24).required(),
    subcontentType: Joi.string().valid(CONSTANT.SUBCONTENT_TYPE.CHAPTER, CONSTANT.SUBCONTENT_TYPE.PAGE).required(),
    parentID: Joi.string().length(24).when('published', {is: true, then: Joi.required()})
});

const takeOffSubcontentSchema = viewSubcontentSchema;

const getSubcontentByIDSchema = viewSubcontentSchema;

const deleteSubcontentSchema = viewSubcontentSchema;

const publishSubcontentsSchema = Joi.object({
    parentID: Joi.string().length(24).messages({
        'string.length': 'contentID must be a valid ObjectID'
    }),
    subcontentType: Joi.string().valid(CONSTANT.SUBCONTENT_TYPE.CHAPTER, CONSTANT.SUBCONTENT_TYPE.PAGE).required(),
    subcontentIDs: Joi.array().items(Joi.string().length(24)).min(1).required()
});

module.exports = {
    takeOffSubcontentSchema,
    updateSubcontentSchema,
    commentSubcontentSchema,
    createSubcontentSchema,
    viewSubcontentSchema,
    getSubcontentByIDSchema,
    deleteSubcontentSchema,
    publishSubcontentsSchema

}