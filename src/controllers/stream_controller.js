const StreamMdl = require('../models/stream');
const MessageMdl = require('../models/message');
const ActivityController = require('../controllers/activity_controller');
const UserController = require('../controllers/user_controller');
const UserMdl = require('../models/user');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

//Get function, returns all available streams
//messages and version are omitted from the results
function getAll(req, res) {
    StreamMdl.find({}, { messages: 0, __v: 0 })
        .populate('host', 'name profilePicture kudos')
        .then(streams => {
            res.status(200).send(streams);
        })
        .catch(err => {
            res.status(401).send(err);
        })
}

//Create function, body should have these properties:
//  title: String,
//  host: User  (ObjectId)
function create(req, res) {
    const newStream = new StreamMdl(req.body);
    newStream.save(err => {
        if (err) return res.status(500).send(err);
        else {
            ActivityController.addActivity(req.body.host, 'User created a new stream');
            return res.status(200).send(newStream); 
        }
        
    });
}

//Update function, URL parameters should have the streamId
//  Body should have    title: String
function update(req, res) {
    StreamMdl.findByIdAndUpdate(req.params.streamId, req.body.title, {new: true}, (err, editedStream) => {
        if (err) return res.stats(500).send(err);
        return res.send(editedStream);
    })
}

function deactivateStream(req, res) {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(today);
    StreamMdl.findByIdAndUpdate(req.params.id, {active: false}, {new: true}, (err, updatedStrm))
    .populate('host')
    .then(updatedStrm => {
        var dif = updatedStrm.host.kudos + (Math.pow(2,(Math.floor((Math.abs(today-updatedStrm.createdAt))/1000/60/60))));
        UserMdl.findByIdAndUpdate(updatedStrm.host, {kudos: dif}, {new: true}, (err, updatedUsr) => {
            console.log(updatedUsr);
            if(err) return res.status(401).send(err);
            else return res.status(200).send({msg: 'Stream ended succesfully!'});
        })
        console.log(dif);
        if(err) return res.status(401).send(err);
    })
}

module.exports = {
    getAll,
    create,
    update,
    deactivateStream
}