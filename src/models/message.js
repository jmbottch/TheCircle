const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Author is required.']
    },
    message: {
        type: String,
        required: [true, 'Message is required.']
    }
}, {
    timestamps: true
});

const Message = mongoose.model('message', MessageSchema);
module.exports = Message;