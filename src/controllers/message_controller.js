const Message = require('../models/message')
const User = require('../models/user')

//depricated
function getAll(req, res) {
  Message.find({}, { __v: 0})
    .then(messages => {
      res.status(200).send(messages);
    })
    .catch(err => {
      res.status(401).send(err);
    });
}

function getStreamMessages(req, res) {
  User.findById(req.params.id, { __v: 0})
  .populate('messages')
  .then(foundUser => {
    UserController.addActivity('User entered a chat');
    res.status(200).send(foundUser.messages)
  })
  .catch(err => {
    res.status(401).send(err)
  })
}

function create(req, res) {
  Message.create(req.body)
  .then(msg => {
    User.findById(req.body.host)
    .then(foundUser => {
      foundUser.messages.push(msg)
      foundUser.save()
      .then(() => {
        //emitNewMsg(req.body.host)
        //socket.emit('getMsgs', req.body.host);
        UserController.addActivity('User created a message');
        res.status(200).send({Message : 'Message saved'})
      })
      .catch(err => {
        Message.remove(msg)
        res.status(401).send({Error:'Error while pushing Message to Host'})
      })
    })
    .catch(err => {
      Message.remove(msg)
      res.status(401).send({Error:'Host not found'})
    })
    .catch(err => {
      console.log(err);
      res.status(401).send({Error: 'Error while creating Message'})
    })
  })
};

module.exports = {
  getAll,
  getStreamMessages,
  create
}