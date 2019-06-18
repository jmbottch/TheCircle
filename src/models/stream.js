const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StreamSchema = new Schema({
    title: {
        type: String,
        validate: {
            validator: (name) => name.length > 2,
            message: 'Name must be longer than two characters.'
        },
        required: [true, 'Name is required.']
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Host is required.']
    },
    viewers: [{
        type: String,
        default: []
    }],
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Stream = mongoose.model('stream', StreamSchema);
module.exports = Stream;