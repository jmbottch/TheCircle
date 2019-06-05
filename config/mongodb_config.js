var env = {
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '3000',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'seeChange'
}

var dburl = process.env.NODE_ENV === 'production' ?
    'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
    'mongodb://localhost/' + env.dbDatabase

var dburl_dev = 'mongodb://seeuser:seepass1@ds231537.mlab.com:31537/seechange';

module.exports = {
    env,
    dburl,
    dburl_dev
};