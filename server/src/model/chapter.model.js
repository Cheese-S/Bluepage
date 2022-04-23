const {
    CommentSchema,
    UserDataSchema,
} = require('./internal')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const ChapterSchema = new Schema({
    parentID: { type: ObjectId, ref: 'Story', required: true },
    title: { type: String, required: true },
    editorContent: { type: Schema.Types.Mixed, default: {} },
    body: { type: Schema.Types.Mixed, default: {} },
    author: { type: UserDataSchema, required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    comments: [{ type: CommentSchema, default: [] }]
},
    { timestamps: true, minimize: false }
)

module.exports = mongoose.model('Chapter', ChapterSchema); 