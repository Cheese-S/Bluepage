const Joi = require('joi');

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

const changePwdSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email()
}).or('name', 'email')

module.exports = {
    registerSchema
}