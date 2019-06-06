const mongoose = require('mongoose')
mongoose.Promise = global.Promise

before((done) => {
    mongoose.disconnect()
    mongoose.connect('mongodb://localhost/circle', {useNewUrlParser: true}, console.log('connected to Test Database'))

    mongoose.connection.once('open', () => {
        done()
    }).on('error', (error) => {console.warn('Error: ', error)})
})

beforeEach((done) => {
    const{users, messages} = mongoose.connection.collections
    users.drop(() => {
        messages.drop(() => {
            done()
        })
    })
})