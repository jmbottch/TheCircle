const express = require('express');
const bodyParser= require('body-parser')
const cors = require('cors');
var mongodb = require('./config/mongodb_connections');
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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

mongodb.createProdConnection();

var server = http.listen(5000, () => {
  console.log('server is running on port', server.address().port);
});

io.on('connection', () =>{
  console.log('a user is connected')
})

module.exports = app;