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
    "any.required": "Please enter all required fields",
    "any.only": "Your password must agree with your passwordConfirmation",
    "object.with": "You must enter passwordConfirmation"
})

module.exports = {
    registerSchema,
    changePwdSchema,
    followUserSchema,
    loginSchema
}