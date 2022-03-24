const {
    SubcommnetSchema,
    CommentSchema
} = require('./internal')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const ComicSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: {type: ObjectId, ref: 'User' ,requierd: true}, 
    views: { type: Number, default: 0 },
    tags: {
        type: String, 
        enum: [
            'Action',
            'Romance',
            'Mystery',
            'Fantasy',
            'Historical', 'Comedy',
            'Fanwork', 'Sci-Fi',
            'Thriller',
            'Psychological'
        ],
        default: []
    },
    votes: {type: Map, of: Boolean},
    contentList: [{type: ObjectId, ref: 'Page', default: []}],
    comments: [{type: CommentSchema, default: []}],
    thumbnail: {type: Buffer}
})

module.exports = mongoose.model('Comic', ComicSchema); 