const jwt = require('jsonwebtoken')
const env = require('../env.config')
const { logger } = require('bs-logger')
const CONSTANT = require('../constant')



function authManager() {

    verify = (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({
                    user: CONSTANT.EMPTY_USER,
                    error: "unauthorized user"
                })
            }

            const verified = jwt.verify(token, env.JWT_SECRET);
            req.locals = {
                userID: verified.userID,
                name: verified.name
            }
            next();
        } catch(e) {
            console.log(e.message);
            return  res.status(401).json({
                user: CONSTANT.EMPTY_USER,
                error: e.message
            })
        }
    }

    signToken = (user) => {
        return jwt.sign({
            userID: user._id,
            name: user.name
        }, env.JWT_SECRET);
    }

    invalidToken = () => {
        return jwt.sign(
            {},
            evn.JWT_SECRET,
            {expiresIn: 0}
        )
    }

    return this
}

const auth = authManager();
module.exports = auth;