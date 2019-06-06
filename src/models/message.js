const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    name: String,
    message: {
        type: String,
        required: [true, 'Message is required.']
    }
});

const Message = mongoose.model('message', MessageSchema);
module.exports = Message;