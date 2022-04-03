const Joi = require('joi');
const CONSTANT = require('../constant')

const registerSchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(8).required(),
    passwordConfirmation: Joi.ref('password'),
    email: Joi.string().email().required(),
    answers: Joi.array().length(3).required()
})
.with('password', 'passwordConfirmation')
.messages({
    "any.required": "Please enter all required fields, [name, password, passwordConfirmation, email, answers]",
    "any.only": "Your password must agree with your passwordConfirmation",
    "object.with": "You must enter passwordConfirmation"
})

const followUserSchema = Joi.object({
    followingUserID: Joi.string().length(24).required().messages({
        "string.length": "FollowingUserID must be a valid ObjectID"
    }),
    action: Joi.string().valid(CONSTANT.FOLLOW_ACTION_TYPE.FOLLOW, CONSTANT.FOLLOW_ACTION_TYPE.UNFOLLOW).required()
})

const loginSchema = Joi.object({
    nameOrEmail: Joi.string().required(),
    password: Joi.string()
})

const changePwdSchema = Joi.object({
    nameOrEmail: Joi.string().when('isLoggedIn', { is: false, then: Joi.required() }),
    answers: Joi.array().length(3).when('isLoggedIn', { is: false, then: Joi.required() }),
    password: Joi.string().min(8).required(),
    passwordConfirmation: Joi.ref('password'),
    isLoggedIn: Joi.boolean().required()
}).with('password', 'passwordConfirmation')
.messages({
    "any.only": "Your password must agree with your passwordConfirmation",
    "object.with": "You must enter passwordConfirmation"
})

const followContentSchema = Joi.object({
    contentID: Joi.string().length(24).messages({
        'string.length': 'contentID must be a valid ObjectID'
    }),
    contentType: Joi.string().valid(CONSTANT.CONTENT_TYPE.STORY, CONSTANT.CONTENT_TYPE.COMIC).required(),
    action: Joi.string().valid(CONSTANT.FOLLOW_ACTION_TYPE.FOLLOW, CONSTANT.FOLLOW_ACTION_TYPE.UNFOLLOW).required()
})

const voteOnContentSchema = Joi.object({
    prev: Joi.string().valid(
        CONSTANT.VOTE_STATE_TYPE.LIKE,
        CONSTANT.VOTE_STATE_TYPE.DISLIKE,
        CONSTANT.VOTE_STATE_TYPE.NEUTRAL
    ).required(),
    current: Joi.string().valid(
        CONSTANT.VOTE_STATE_TYPE.LIKE,
        CONSTANT.VOTE_STATE_TYPE.DISLIKE,
        CONSTANT.VOTE_STATE_TYPE.NEUTRAL
    ).required(),
    contentID: Joi.string().length(24).required(),
    contentType: Joi.string().valid(CONSTANT.CONTENT_TYPE.STORY, CONSTANT.CONTENT_TYPE.COMIC).required(),
});

const voteOnSubcontentSchema = Joi.object({
    prev: Joi.string().valid(
        CONSTANT.VOTE_STATE_TYPE.LIKE,
        CONSTANT.VOTE_STATE_TYPE.DISLIKE,
        CONSTANT.VOTE_STATE_TYPE.NEUTRAL
    ).required(),
    current: Joi.string().valid(
        CONSTANT.VOTE_STATE_TYPE.LIKE,
        CONSTANT.VOTE_STATE_TYPE.DISLIKE,
        CONSTANT.VOTE_STATE_TYPE.NEUTRAL
    ).required(),
    subcontentID: Joi.string().length(24).required(),
    subcontentType: Joi.string().valid(CONSTANT.SUBCONTENT_TYPE.PAGE, CONSTANT.SUBCONTENT_TYPE.CHAPTER).required(),
})

const getUserByIDSchema = Joi.object({
    id: Joi.string().length(24).required()
})

module.exports = {
    registerSchema,
    changePwdSchema,
    followUserSchema,
    followContentSchema,
    voteOnContentSchema,
    voteOnSubcontentSchema, 
    loginSchema,
    getUserByIDSchema
}