<<<<<<< HEAD
const Message = require('../models/message')
const StreamMdl = require('../models/stream')


function getAll(req, res) {
  Message.find({}, {_v: 0})
=======
const Message = require('../models/message');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function getAll(req, res) {
  Message.find({})
  .sort('-createdAt')
>>>>>>> 9be2d3587a76454d90b3d80c2848dcebbb0b0605
    .then(messages => {
      res.status(200).send(messages);
    })
    .catch(err => {
      res.status(401).send(err);
    });
}

<<<<<<< HEAD
function getStreamMessages(req,res) {
  StreamMdl.findById(req.params.id)
  .sort('-createdAt')
  .then(stream => {
    res.send(200).send(stream.messages)
  })
  .catch(err => {
    res.status(401).send(err)
  })
}

function create(req, res) {
  Message.create(req.body)
  .then((msg) => {
    StreamMdl.findById(req.body.author)
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
=======
function create(req, res) {
  const newMessage = new Message(req.body);
  newMessage.save(err => {
    if (err) return res.status(500).send(err);
    else {
      io.emit('message', req.body);
      return res.status(200).send(newMessage);
   }
   });
>>>>>>> 9be2d3587a76454d90b3d80c2848dcebbb0b0605
};

module.exports = {
  getAll,
<<<<<<< HEAD
  getStreamMessages,
=======
>>>>>>> 9be2d3587a76454d90b3d80c2848dcebbb0b0605
  create
}