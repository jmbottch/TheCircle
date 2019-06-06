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
  try {
    if (!req.body.name) {
      res.status(401).send({ Error: 'No name provided' })
    } else if (!req.body.message) {
      res.status(401).send({ Error: 'No message provided' })
    } else {
      var message = new Message(req.body);

      var savedMessage = message.save()

      var censored = Message.findOne({ message: 'badword' });
      if (censored)
        Message.remove({ _id: censored.id })
      else
        io.emit('message', req.body);
      res.status(200).send({ Message: 'Message created' })
    }
  }
  catch (err) {
    res.status(401).send(error);
    return console.log('error', error);
  }

};

module.exports = {
  getAll,
  post
}