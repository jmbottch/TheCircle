const express = require('express');
const bodyParser= require('body-parser')
const cors = require('cors');
var mongodb = require('./config/mongodb_connections');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const userroutes = require('./routes/user_routes');

//enabled routes
userroutes(app);

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

app.listen(process.env.PORT || 3000, () => {
    console.log('App is ready for requests.')
  })
  .on('error', (error) => {
    console.warn('Warning', error.toString());
});

module.exports = app;