const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    userid : {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    activity : {
        type: String
    },
   
}, {
    timestamps: true
})