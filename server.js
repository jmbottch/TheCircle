const express = require('express');
const bodyParser= require('body-parser')
const cors = require('cors');
var mongodb = require('./config/mongodb_connections');
var config = require('./config/mongodb_config');
const app = express();
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(__dirname));

const userroutes = require('./routes/user_routes');
const messageroutes = require('./routes/message_routes');

//enabled routes
userroutes(app);
messageroutes(app);

mongodb.createDevConnection();

var server = http.listen(config.env.port, () => {
  console.log('server is running on port', config.env.port);
});

io.on('connection', () =>{
  console.log('a user is connected')
})

module.exports = app;