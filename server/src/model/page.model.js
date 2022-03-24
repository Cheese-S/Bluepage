const {
    CommentSchema
} = require('./internal')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const PageSchema = new Schema({
    parentID: { type: ObjectId, ref: 'Comic', required: true },
    editorContent: { type: Object },
    content: { type: Buffer },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    views: { type: Number, default: 0 },
    votes: { type: Schema.Types.Map, of: Boolean },
    published: { type: Boolean, default: false },
    comments: [{ type: CommentSchema, default: [] }]
},
    { timestamps: true }
)

module.exports = mongoose.model('Page', PageSchema); 