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
    viewContentSchema,
    deleteContentSchema,
    getContentByIDSchema,
    getContentsSchema
} = require('./content.schema')

const {
    takeOffSubcontentSchema,
    updateSubcontentSchema,
    commentSubcontentSchema,
    createSubcontentSchema,
    getSubcontentByIDSchema,
    viewSubcontentSchema,
    deleteSubcontentSchema,
    publishSubcontentsSchema
} = require('./subcontent.schema')

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
    viewContent: viewContentSchema,
    deleteContent: deleteContentSchema,
    getContentByID: getContentByIDSchema,
    getContents: getContentsSchema,

    takeOffSubcontent:takeOffSubcontentSchema,
    updateSubcontent:updateSubcontentSchema,
    commentSubcontent: commentSubcontentSchema,
    createSubcontent: createSubcontentSchema,
    viewSubcontent: viewSubcontentSchema,
    deleteSubcontent: deleteSubcontentSchema,
    getSubcontentByID: getSubcontentByIDSchema,
    publishSubcontents: publishSubcontentsSchema

}