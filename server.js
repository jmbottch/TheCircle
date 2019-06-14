const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
var mongodb = require('./config/mongodb_connections');
var config = require('./config/mongodb_config');
const app = express();
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cert = require('./src/services/certificates');
io.origins('*:*')
app.options('*', cors());
mongoose.set('useFindAndModify', false);


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname));

const userroutes = require('./routes/user_routes');
const messageroutes = require('./routes/message_routes');
const streamroutes = require('./routes/stream_routes');
const activityroutes = require('./routes/activity_routes');

const User = require('./src/models/user');
const Message = require('./src/models/message');
const StreamMdl = require('./src/models/stream');

const ActivityController = require('./src/controllers/activity_controller');

//enabled routes
userroutes(app);
messageroutes(app);
streamroutes(app);
activityroutes(app);

mongodb.createDevConnection();

app.post('/api/message/', function (req, res) {
  let signature = req.body.signature;
  let message = req.body.message;
  let certificate = req.body.certificate;
  let verified = cert.verifyMessage(signature, message, certificate);
  Message.create(req.body)
    .then(msg => {
      User.findById(req.body.host)
        .then(foundUser => {
          msg.profilePicture = foundUser.profilePicture;
          msg.save();
          foundUser.messages.push(msg)
          foundUser.save()
            .then(() => {
              emitNewMsg(req.body.host)
              ActivityController.addActivity(req.body.author, 'Posted a message')
              res.status(200).send({ Message: 'Message saved', Verified: verified });
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

  socket.on('startWatching', userIds => {
    ActivityController.addActivity(userIds.viewer, 'Started watching stream with host: ' + userIds.host)
    addToViewers(userIds.host, socket.id);
    io.emit('viewSingle', 'new viewcount');
  });

  socket.on('stopWatching', userIds => {
    removeFromOne(userIds.host, socket.id)
    io.emit('viewSingle', 'new viewcount');
  });

  socket.on('getViewcount', host => {
    io.to(`${socketId}`).emit('viewcount', getViewcount(host));
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} has disconnected`);
    removeFromViewers('all', socket.id);
    io.emit('viewers', io.engine.clientsCount);
    io.emit('viewSingle', 'new viewcount');
  });

  io.emit('viewers', io.engine.clientsCount);

  console.log(`Socket ${socket.id} has connected`);
});

function getViewcount(host) {
  StreamMdl.findOne({ host: host })
    .then(strm => {
      if (strm == null) {
        console.log('Stream not found with host: ' + host)
      } else {
        console.log(strm.viewers.length);
        return strm.viewers.length;
      }
    })
}

function addToViewers(host, socketid) {
  StreamMdl.findOne({ host: host })
    .then(strm => {
      if (strm == null) {
        console.log('Stream not found with host: ' + host)
        return 'not added';
      } else {
        strm.viewers.push(socketid);
        strm.save();
        return 'added';
      }
    });
};

function removeFromOne(host, socketid) {
  StreamMdl.findOne({ host: host })
    .then(strm => {
      if (strm == null) {
        console.log('Stream not found with host: ' + host)
      } else {
        var index = strm.viewers.indexOf(socketid);
        if (index != -1) {
          console.log('strm pre', strm.viewers)
          strm.viewers.splice(index, 1);
          strm.save();
          console.log('strm post', strm.viewers)

        }
      }
    });
}

function removeFromViewers(host, socketid) {
  if (host == 'all') {
    StreamMdl.find({})
      .then(strms => {
        if (strms == null) {
          console.log('no streams found')
        } else {
          for (let i of strms) {
            var index = i.viewers.indexOf(socketid);
            if (index != -1) {
              //console.log('viewers PRE', i.viewers)
              //console.log('index', index)
              i.viewers.splice(index, 1);
              //console.log('viewers post', i.viewers)
              //i.save(); //<-- doesnt save
              StreamMdl.findById(i._id)
              .then(newStrm => {
                console.log('unsaved', newStrm);
                newStrm.viewers = i.viewers;
                newStrm.save();
                console.log('saved', newStrm);
              })
            }
          }
        }
      });
  }
};

function emitNewMsg(userId) {
  console.log('emitting')
  io.emit('messages', userId);
};

http.listen(process.env.PORT || 5000, () => {
  console.log('server is running on port 5000');
});

module.exports = app;
