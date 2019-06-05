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
    nickname: String,
    password: {
        type: String,
        validate: {
            validator: (password) => password.length > 2,
            message: 'Password must be at least three characters.'
        },
        required: [true, 'Password is required.']
    },
    admin: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;