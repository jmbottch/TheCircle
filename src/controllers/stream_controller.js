const StreamMdl = require('../models/stream');

//Get function, returns all available streams
//messages and version are omitted from the results
function getAll(req, res) {
    StreamMdl.find({}, { messages: 0, __v: 0 })
        .populate('host')
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
        return res.status(200).send(newStream);
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

module.exports = {
    getAll,
    create,
    update
}