const {
    CommentSchema
} = require('./internal')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const PageSchema = new Schema({
    title: {type: String, required: true},
    parentID: { type: ObjectId, ref: 'Comic', required: true },
    editorContent: { type: Object },
    content: { type: String },
    author: { type: UserDataSchema, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    comments: [{ type: CommentSchema, default: [] }]
},
    { timestamps: true }
)

module.exports = mongoose.model('Page', PageSchema); 