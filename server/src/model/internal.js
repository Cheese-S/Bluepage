const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const SubcommnetSchema = new Schema(
    {
        user: {
            ObjectId,
            ref: 'User',
            required: true
        },
        text: { type: String, required: true }
    }
)

const CommentSchema = new Schema(
    {
        user: {
            ObjectId,
            ref: 'User',
            required: true
        },
        text: { type: String, required: true },
        subcomments: [{ type: subcommentSchema, default: [] }]
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

module.exports = {
    SubcommnetSchema,
    CommentSchema
}