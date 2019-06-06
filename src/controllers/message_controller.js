const Message = require('../models/message');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function getAll(req, res) {
  Message.find({})
  .sort('-createdAt')
    .then(messages => {
      res.status(200).send(messages);
    })
    .catch(err => {
      res.status(401).send(err);
    });
}

function create(req, res) {
  const newMessage = new Message(req.body);
  newMessage.save(err => {
    if (err) return res.status(500).send(err);
    else {
      io.emit('message', req.body);
      return res.status(200).send(newMessage);
   }
   });
};

module.exports = {
  getAll,
  create
}