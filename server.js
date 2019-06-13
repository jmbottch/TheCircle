const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
var mongodb = require('./config/mongodb_connections');
var config = require('./config/mongodb_config');
const app = express();
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.origins('*:*')
app.options('*', cors());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname));

const userroutes = require('./routes/user_routes');
const messageroutes = require('./routes/message_routes');
const streamroutes = require('./routes/stream_routes');

const User = require('./src/models/user');
const Message = require('./src/models/message');
const StreamMdl = require('./src/models/stream');


//enabled routes
userroutes(app);
messageroutes(app);
streamroutes(app);

mongodb.createDevConnection();


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
    this.emitNewMsg();
  });

  // socket.on('startWatching', userIds => {
  //   addToViewers(userIds.host, userIds.viewer)
  // });

  socket.on('startWatching', function (userIds, fn) {
    fn(addToViewers(userIds.host, userIds.viewer));
  });

  // socket.on('stopWatching', userIds => {
  //   removeFromViewers(userIds.host, userIds.viewer)
  // });

  socket.on('getViewcount', host => {
    io.to(`${socketId}`).emit('viewcount', getViewcount(host));
  });

  socket.on('disconnect', () => {
    io.emit('viewers', io.engine.clientsCount);
    console.log(`Socket ${socket.id} has disconnected`);
  });

  io.emit('viewers', io.engine.clientsCount);
  console.log(`Socket ${socket.id} has connected`);
});

function getViewcount(host) {
  StreamMdl.findOne({host: host})
  .then(strm => {
    if (strm == null) {
      console.log('Stream not found with host: ' + host)
    } else {
      console.log(strm.viewers.length());
      return strm.viewers.length();
    }
  })
}

function addToViewers(host, viewer) {
  StreamMdl.findOne({host: host})
  .then(strm => {
    if (strm == null) {
      console.log('Stream not found with host: ' + host)
      return 'not added';
    } else {
      strm.viewers.push(viewer);
      strm.save();
      return 'added';
    }
  });
};

function removeFromViewers(host, viewer) {
  StreamMdl.findOne({host: host})
  .then(strm => {
    if (strm == null) {
      console.log('Stream not found with host: ' + host)
    } else {
      console.log(strm.viewers)
      strm.viewers.splice(viewer, 1);
      strm.save();
      console.log(strm.viewers)
    }
  });
};

function emitNewMsg(userId) {
  console.log('emitting')
  io.emit('messages', userId);
};

http.listen(process.env.PORT || 5000, () => {
  console.log('server is running on port 5000');
});

module.exports = app;

