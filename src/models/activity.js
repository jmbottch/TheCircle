const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    userid : {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    activity : {
        type: String
    },
    category: {
        type: String
    }

    //Possible categories: EndStream, CreateStream, PostMessage, StartWatching
   
}, {
    timestamps: true
})

const Activity = mongoose.model('activity', ActivitySchema);
module.exports = Activity;