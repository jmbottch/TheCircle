const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        validate: {
            validator: (name) => name.length > 2,
            message: 'Name must be longer than two characters.'
        },
        required: [true, 'Name is required.']
    },
    password: {
        type: String,
        validate: {
            validator: (password) => password.length > 2,
            message: 'Password must be at least three characters.'
        },
        required: [true, 'Password is required.']
    },
    profilePicture: {
        type: String,
        default: ''
    },
    activities: [{
        type: String,
        default: []
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'message',
        default: []
    }],
    kudos:
    {
        type: Number,
        default: 10
    },
    activities: [{
        type: Schema.Types.ObjectId,
        ref: 'activity'
    }],
    totalStreamTime: {
        type: Number,
        default: 0
    },

    privateKey: {
        type: String
    },
    publicKey: {
        type: String
    },
    certificate: {
        type: String
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;