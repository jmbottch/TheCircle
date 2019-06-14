const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    authorname: {
        type:Schema.Types.String,
        ref:'user',
        required: [true, 'Authorname is required']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Author is required.']
    },
    message: {
        type: String,
        required: [true, 'Message is required.']
    },
    profilePicture: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Message = mongoose.model('message', MessageSchema);
module.exports = Message;