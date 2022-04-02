const jwt = require('jsonwebtoken')
const env = require('../env.config')
const { logger } = require('bs-logger')
const CONSTANT = require('../constant')
const UserService = require('../service/user.service')




function authManager() {

    verify = async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({
                    user: CONSTANT.EMPTY_USER,
                    error: "unauthorized user"
                })
            }
            
            const verified = jwt.verify(token, env.JWT_SECRET);
            console.log(verified);
            

            const user = await UserService.findUser({_id: verified.userID});
            if (!user) {
                return  res.status(400).json({
                    user: CONSTANT.EMPTY_USER,
                    error: "This user does not exist"
                })
            }
            req.locals = {
                ...req.locals,
                userID: verified.userID,
                name: verified.name,
                user: user
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
            env.JWT_SECRET,
            {expiresIn: 0}
        )
    }

    return this
}

const auth = authManager();
module.exports = auth;