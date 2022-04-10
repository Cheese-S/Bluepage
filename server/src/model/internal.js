const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const CONSTANT = require('../constant')

const UserDataSchema = new Schema(
    {
        id: { type: ObjectId, required: true },
        name: { type: String, required: true }
    },
    { _id: false }  
)


const SubcommentSchema = new Schema(
    {
        user: { type: UserDataSchema, required: true },
        text: { type: String, required: true }
    },
    { 
        timestamps: { createdAt: true, updatedAt: false },
        _id: false
    }
)

const CommentSchema = new Schema(
    {
        user: { type: UserDataSchema, required: true },
        text: { type: String, required: true },
        subcomments: [{ type: SubcommentSchema, default: [] }]
    },
    { 
        timestamps: { createdAt: true, updatedAt: false },
    }
)

module.exports = {
    SubcommentSchema,
    CommentSchema,
    UserDataSchema,
}