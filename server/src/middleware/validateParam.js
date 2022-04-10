const Joi = require('joi')
const Schemas = require('../schema')

module.exports = function(schema) {
    if (!Schemas.hasOwnProperty(schema))
        throw new Error(`${schema} does not exist`)
    return async function (req, res, next) {
        try {
            const validated = await Schemas[schema].validateAsync(req.params);
            req.params = validated
            next()
        } catch (e) {
            if (Joi.isError(e)) {
                console.log(e.details[0].message);
                return res.status(400).json({
                    error: e.details[0].message
                })
            }
        }
    }
}