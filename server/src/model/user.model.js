const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const notificationSchema = new Schema({
    text: { type: String, required: true },
    link: { type: ObjectId, required: true }
},
    { 
        timestamps: { createdAt: true, updatedAt: false },
        _id: false
    }
)

const UserSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true },
        comicNotifications: { type: [notificationSchema], default: [] },
        storyNotifications: { type: [notificationSchema], default: [] },
        followers: [{ type: ObjectId, ref: 'User', default: [] }],
        followingComics: [{ type: ObjectId, ref: 'Comic', default: [] }],
        followingStories: [{ type: ObjectId, ref: 'Story', default: [] }],
        likedComics: [{ type: ObjectId, ref: 'Comic', default: [] }],
        dislikedComics: [{ type: ObjectId, ref: 'Comic', default: [] }],
        likedStories: [{ type: ObjectId, ref: 'Story', default: [] }],
        dislikedStories: [{ type: ObjectId, ref: 'Story', default: [] }],
        likedPages: [{ type: ObjectId, ref: 'Comic', default: [] }],
        dislikedPages: [{ type: ObjectId, ref: 'Comic', default: [] }],
        likedChapters: [{ type: ObjectId, ref: 'Story', default: [] }],
        dislikedChapters: [{ type: ObjectId, ref: 'Story', default: [] }],
        ownComics: [{ type: ObjectId, ref: 'Story', default: [] }],
        ownStories: [{ type: ObjectId, ref: 'Comic', default: [] }],
        answers: [{ type: String, required: true, immutable: true }]
    }
)

module.exports = mongoose.model('User', UserSchema);