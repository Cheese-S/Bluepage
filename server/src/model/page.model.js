const {
    CommentSchema,
    UserDataSchema
} = require('./internal')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const PageSchema = new Schema({
    title: {type: String, required: true},
    parentID: { type: ObjectId, ref: 'Comic', required: true },
    editorContent: { type: Schema.Types.Mixed },
    body: { type: Schema.Types.Mixed, required: true },
    author: { type: UserDataSchema, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    comments: [{ type: CommentSchema, default: [] }]
},
    { timestamps: true, minimize: false }
)

module.exports = mongoose.model('Page', PageSchema); 