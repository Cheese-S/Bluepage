const { 
    registerSchema,
    changePwdSchema,
    followUserSchema,
    loginSchema,
    followContentSchema,
    voteOnContentSchema,
    voteOnSubcontentSchema
} = require('./user.schema')

const {
    takeOffContentSchema,
    updateContentSchema,
    commentContentSchema,
    createContentSchema,
    setContentThumbnailSchema,
    viewContentSchema
} = require('./content.schema')

module.exports = {
    registerUser: registerSchema,
    changeUserPwd: changePwdSchema,
    followUser: followUserSchema,
    loginUser: loginSchema,
    followContent: followContentSchema,
    voteOnContent: voteOnContentSchema,
    voteOnSubcontent: voteOnSubcontentSchema,

    takeOffContent: takeOffContentSchema,
    updateContent: updateContentSchema,
    commentContent: commentContentSchema,
    createContent: createContentSchema,
    setContentThumbnail: setContentThumbnailSchema,
    viewContent: viewContentSchema
}