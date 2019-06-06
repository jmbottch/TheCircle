const Message = require('../models/message')
const StreamMdl = require('../models/stream')


function getAll(req, res) {
  Message.find({}, { __v: 0})
    .then(messages => {
      res.status(200).send(messages);
    })
    .catch(err => {
      res.status(401).send(err);
    });
}

function getStreamMessages(req,res) {
  StreamMdl.findById(req.params.id, { __v: 0})
  .populate('messages')
  .then(stream => {
    res.status(200).send(stream.messages)
  })
  .catch(err => {
    res.status(401).send(err)
  })
}

function create(req, res) {
  Message.create(req.body)
  .then((msg) => {
    StreamMdl.findById(req.body.stream)
    .then(stream => {
      stream.messages.push(msg)
      stream.save()
      .then(() => {
        res.status(200).send({Message : 'Message saved'})
      })
      .catch(() => {
        Message.remove(msg)
        res.status(401).send({Error:'Error while pushing Message to Stream'})
      })
    })
    .catch(err => {
      Message.remove(msg)
      res.status(401).send({Error:'Stream not found'})
    })
    .catch(err => {
      res.status(401).send({Error: 'Error while creating Message', err: err})
    })
  })
};

module.exports = {
  getAll,
  getStreamMessages,
  create
}