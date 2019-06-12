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
const UserController = require('./src/controllers/user_controller');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname));

const userroutes = require('./routes/user_routes');
const messageroutes = require('./routes/message_routes');
const streamroutes = require('./routes/stream_routes');

const User = require('./src/models/user');
const Message = require('./src/models/message')
const Activity = require('./src/models/activity')

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
              addActivity(req.body.author, 'Posted a messages')
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

  // socket.on('getGlobalViewers', () => {
  //   console.log('Total connected sockets: ', io.engine.clientsCount)
  //   io.emit('viewers', io.engine.clientsCount);
  // })

  socket.on('disconnect', (reason) => {
    io.emit('viewers', io.engine.clientsCount);
    console.log(`Socket ${socket.id} has disconnected`);
  });

  io.emit('viewers', io.engine.clientsCount);
  //io.sockets.emit('messages');
  console.log(`Socket ${socket.id} has connected`);
});

function emitNewMsg(userId) {
  console.log('emitting')
  io.emit('messages', userId);
}

http.listen(process.env.PORT || 5000, () => {
  console.log('server is running on port 5000');
});

 function addActivity(author, res, input) {
  Activity.create({
    userid : author,
    activity: input
  })
    .then(activity => {
      User.findById(author)
    .then((user) => {
      if(user === null) {
        res.status(401).send({Error: 'User does not exist'})
      } else {
        user.activities.push(activity)
        //user.push({activities : req.body})
        console.log(user)
      }
    })
  })
  
  // User.findById(req.body.host)
  //     .then(user => {
  //         if (user === null) {
  //             res.status(401).send({ Error: 'User does not exist.' })
  //         }
  //         else {
  //             user.set({ activity: input })
  //             user.save()
  //                 .then(() => res.status(200).send({ Message: 'Activity succesfully added.' }))
  //                 .catch((err) => res.status(401).send(err))
  //         }
  //     })
}

module.exports = app;

