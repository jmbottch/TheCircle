const Message = require('../models/message');


function getAll(req, res) {
  Message.find({})
    .then(messages => {
      res.status(200).send(messages);
    })
    .catch(err => {
      res.status(401).send(err);
    })
}

function post(req, res) {
  const newMessage = new Message(req.body);
  newMessage.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(newMessage);
  });
};

module.exports = {
  getAll,
  post
}