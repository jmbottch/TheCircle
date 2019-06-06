const mongoose = require('mongoose')
const app = require('../server')
const request = require('supertest')
const chai = require('chai')
expect = chai.expect

const User = mongoose.model('user')
const Message = mongoose.model('message')

describe('the message_controller', () => {
    msg = new Message({
        name: 'Test Message',
        message: 'Content'
    })

    user = new User({
        name: 'Test User',
        password: 'Password',
        admin: true
    })

    noname = new User({
        message: 'Content'
    })

    nocontent = new User ({
        name:'Test Message'
    })

    it('can fetch a list of messages', (done) => {
        request(app)
            .get('/api/messages')
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.be.empty
                done()
            })
    })

    it('can create a new message', (done) => {
        request(app)
            .post('/api/user/register')
            .send(user)
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200)
                var token = 'Bearer ' + res.body.token
                request(app)
                    .post('/api/messages')
                    .send(msg)
                    .set({ 'Authorization': token })
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200)
                        done()
                    })
            })
    })

    it('throws an error when not logged in on posting a message', (done) => {
        request(app)
        .post('/api/messages')
        .send(msg)
        .end(function(err,res) {
            expect(res.body.Error).to.equal('No token provided.')
            done()
        })
    })

    it('throws an error when message-name is not provided', (done) => {
        request(app)
        .post('/api/user/register')
        .send(user)
        .end(function(err,res) {
            expect(res.statusCode).to.equal(200)
            expect(res.body.auth).to.equal(true)
            var token = 'Bearer ' + res.body.token
            request(app)
            .post('/api/messages')
            .send(noname)
            .set({'Authorization' : token})
            .end(function(err,res) {
                expect(res.statusCode).to.equal(401)
                expect(res.body.Error).to.equal('No name provided')
                done()
            })
        })
    })

    it('throws an error when message-contenct is not provided', (done) => {
        request(app)
        .post('/api/user/register')
        .send(user)
        .end(function(err,res) {
            expect(res.statusCode).to.equal(200)
            expect(res.body.auth).to.equal(true)
            var token = 'Bearer ' + res.body.token
            request(app)
            .post('/api/messages')
            .send(nocontent)
            .set({'Authorization' : token})
            .end(function(err,res) {
                expect(res.statusCode).to.equal(401)
                expect(res.body.Error).to.equal('No message provided')
                done()
            })
        })
    })
})