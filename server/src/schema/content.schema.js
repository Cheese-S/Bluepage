const Joi = require('joi');
const CONSTANT = require('../constant')

const createContentSchema = Joi.object({
    contentType: Joi.string().valid(CONSTANT.CONTENT_TYPE.STORY, CONSTANT.CONTENT_TYPE.COMIC).required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    tags: Joi.array().items(Joi.string().valid(
        CONSTANT.BP_TAGS.ACTION,
        CONSTANT.BP_TAGS.COMEDY,
        CONSTANT.BP_TAGS.FANTASY,
        CONSTANT.BP_TAGS.FANWORK,
        CONSTANT.BP_TAGS.HISTORICAL,
        CONSTANT.BP_TAGS.MYSTERY,
        CONSTANT.BP_TAGS.PSYCHOLOGICAL,
        CONSTANT.BP_TAGS.ROMANCE,
        CONSTANT.BP_TAGS.SCI_FI,
        CONSTANT.BP_TAGS.THRILLER,
    )).required()
});

const commentContentSchema = Joi.object({
    action: Joi.string().valid(
        CONSTANT.COMMENT_ACTION_TYPE.COMMENT,
        CONSTANT.COMMENT_ACTION_TYPE.SUBCOMMENT
    ).required(),
    commentID: Joi.string().length(24).when('action', {is: CONSTANT.COMMENT_ACTION_TYPE.SUBCOMMENT, then: Joi.required()}),
    comment: Joi.string().required(),
    contentType: Joi.string().valid(CONSTANT.CONTENT_TYPE.STORY, CONSTANT.CONTENT_TYPE.COMIC).required(),
    contentID: Joi.string().length(24).required() 
});



const viewContentSchema = Joi.object({
    contentID: Joi.string().length(24).required(),
    contentType: Joi.string().valid(CONSTANT.CONTENT_TYPE.STORY, CONSTANT.CONTENT_TYPE.COMIC).required(),
})

const updateContentSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    tags: Joi.array().items(Joi.string().valid(
        CONSTANT.BP_TAGS.ACTION,
        CONSTANT.BP_TAGS.COMEDY,
        CONSTANT.BP_TAGS.FANTASY,
        CONSTANT.BP_TAGS.FANWORK,
        CONSTANT.BP_TAGS.HISTORICAL,
        CONSTANT.BP_TAGS.MYSTERY,
        CONSTANT.BP_TAGS.PSYCHOLOGICAL,
        CONSTANT.BP_TAGS.ROMANCE,
        CONSTANT.BP_TAGS.SCI_FI,
        CONSTANT.BP_TAGS.THRILLER,
    )).required(),
    published: Joi.boolean().required(),
    contentID: Joi.string().length(24).required(),
    contentType: Joi.string().valid(CONSTANT.CONTENT_TYPE.STORY, CONSTANT.CONTENT_TYPE.COMIC).required(),
});

const setContentThumbnailSchema = viewContentSchema; 

const takeOffContentSchema = viewContentSchema;

module.exports = {
    takeOffContentSchema,
    updateContentSchema,
    commentContentSchema,
    createContentSchema,
    viewContentSchema,
    setContentThumbnailSchema
}