const {
    CommentSchema,
    UserDataSchema
} = require('./internal')

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const StorySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: UserDataSchema, required: true },
    views: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    tags: {
        type: [String],
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
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    contentList: [{
        subcontent: { type: ObjectId, ref: 'Chapter' },
        _id: false
    }],
    comments: [{ type: CommentSchema, default: [] }],
    thumbnail: { type: Buffer }
},
    { timestamps: true }
)

StorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Story', StorySchema); 