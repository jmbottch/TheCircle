const mongoose = require('mongoose')
const app = require('../server')
const request = require('supertest')
const chai = require('chai')
expect = chai.expect

const User = mongoose.model('user')
const Message = mongoose.model('message')

describe('the message_controller', () => {
    msg = new Message({
        author: 'Test Message',
        message: 'Content'
    })

    user = new User({
        author: 'Test User',
        password: 'Password',
        admin: true
    })

    noauthor = new User({
        message: 'Content'
    })

    nocontent = new User ({
        author:'Test Message'
    })

    it('can fetch a list of messages', (done) => {
        request(app)
            .get('/api/message/all')
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
                    .post('/api/message/')
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
        .post('/api/message/')
        .send(msg)
        .end(function(err,res) {
            expect(res.body.Error).to.equal('No token provided.')
            done()
        })
    })

    it('throws an error when message-author is not provided', (done) => {
        request(app)
        .post('/api/user/register')
        .send(user)
        .end(function(err,res) {
            expect(res.statusCode).to.equal(200)
            expect(res.body.auth).to.equal(true)
            var token = 'Bearer ' + res.body.token
            request(app)
            .post('/api/message')
            .send(noauthor)
            .set({'Authorization' : token})
            .end(function(err,res) {
                expect(res.statusCode).to.equal(401)
                expect(res.body.Error).to.equal('No author provided')
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
            .post('/api/message')
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