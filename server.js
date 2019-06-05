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

//disabled routes
//none

// var env = process.argv[2] || 'dev';
// switch (env) {
//     case 'dev':
//       mongodb.createTestConnection();
//       break;
//     case 'prod':
//       mongodb.createProdConnection();
//       break;
//     case 'test':
//       mongodb.createTestConnection();
//       break;
// }

mongodb.createDevConnection();

// app.listen(process.env.PORT || 5000, () => {
//     console.log('App is ready for requests.')
//   })
//   .on('error', (error) => {
//     console.warn('Warning', error.toString());
// });

var server = http.listen(5000, () => {
  console.log('server is running on port', server.address().port);
});

io.on('connection', () =>{
  console.log('a user is connected')
})

module.exports = app;