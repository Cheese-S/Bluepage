const {
    CommentSchema,
    UserDataSchema,
} = require('./internal')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const ChapterSchema = new Schema({
    parentID: { type: ObjectId, ref: 'Story', required: true },
    title: {type: Stirng, required: true },
    editorContent: { type: Object },
    content: { type: Object },
    author: { type: UserDataSchema, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    comments: [{ type: CommentSchema, default: [] }]
},
    { timestamps: true }
)

module.exports = mongoose.model('Chapter', ChapterSchema); 