const mongoose = require('mongoose');
const config = require('./mongodb_config');

mongoose.Promise = global.Promise;

function createDevConnection() {
    mongoose.connect(config.dburl_dev, { useNewUrlParser: true });
    var connection = mongoose.connection
        .once('open', () => console.log('Connected to Mongo on MLab locally'))
        .on('error', (error) => {
            console.warn('Warning', error.toString());
        });
}

function createTestConnection() {
    mongoose.connect('mongodb://localhost/' + config.env.dbDatabase, {useNewUrlParser: true})
    var connection = mongoose.connection
        .once('open', () => console.log('Connected to Mongo on localhost to test'))
        .on('error', (error) => {
            console.warn('Warning', error.toString());
        });
}

function createProdConnection() {
    mongoose.connect(config.dburl, { useNewUrlParser: true });
    var connection = mongoose.connection
        .once('open', () => console.log('Connected to Mongo on MLab via heroku'))
        .on('error', (error) => {
            console.warn('Warning', error.toString());
        });
}

var connection = mongoose.connection

module.exports = {
    connection,
    createDevConnection,
    createTestConnection,
    createProdConnection
}