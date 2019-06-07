const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
var mongodb = require('./config/mongodb_connections');
const app = express();
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname));

const userroutes = require('./routes/user_routes');
const messageroutes = require('./routes/message_routes');
const streamroutes = require('./routes/stream_routes');

const User = require('./src/models/user');
const Message = require('./src/models/message')

//enabled routes
userroutes(app);
messageroutes(app);
streamroutes(app);

mongodb.createDevConnection();

var messages = [];

function emitNewMsg(userId) {
  User.findById(userId, { __v: 0 })
    .populate('messages')
    .then(foundUser => {
      console.log('emitting:')
      io.sockets.emit('messages', foundUser.messages);
    });
}

app.post('/api/message/', function (req, res) {
  Message.create(req.body)
    .then(msg => {
      User.findById(req.body.host)
        .then(foundUser => {
          foundUser.messages.push(msg)
          foundUser.save()
            .then(() => {
              emitNewMsg(req.body.host)
              res.status(200).send({ Message: 'Message saved' })
            })
            .catch(err => {
              Message.remove(msg)
              console.log(err);
              res.status(401).send({ Error: 'Error while pushing Message to Host' })
            })
        })
        .catch(err => {
          Message.remove(msg)
          res.status(401).send({ Error: 'Host not found' })
        })
        .catch(err => {
          console.log(err);
          res.status(401).send({ Error: 'Error while creating Message' })
        })
    })
})

io.on('connection', socket => {
  socket.on('getMsgs', userId => {
    User.findById(userId, { __v: 0 })
      .populate('messages')
      .then(foundUser => {
        console.log('emitting:')
        socket.emit('getMsgs', foundUser.messages);
      });
  });

  //   socket.on('addMsg', msg => {
  //     io.emit('messages', messages);
  //     socket.emit('messages', messages);
  // });

  //io.sockets.emit('messages', messages);
  console.log(`Socket ${socket.id} has connected`);
});

http.listen(process.env.PORT | 5000, () => {
  console.log('server is running on port 5000');
});

module.exports = app;

