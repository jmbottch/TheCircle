const mongoose = require('mongoose')
const app = require('../server')
const request = require('supertest')
const chai = require('chai')
expect = chai.expect

const User = mongoose.model('user')
const Message = mongoose.model('message')
const Stream = mongoose.model('stream')

describe('the stream_controller ', () => {


    user = new User({
        name: 'Test User',
        password: 'Password',
        admin: true
    })

    stream = new Stream({
        title: 'Test Stream',
        host: user.id,
        active: true
    })

    notitle = new Stream({
        host: user.id,
        active: true
    })

    nohost = new Stream({
        title: 'Test Stream',
        active: true
    })

    it('can create a new stream', (done) => {
        request(app)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200)
                expect(res.body.auth).to.equal(true)
                var token = 'Bearer ' + res.body.token
                User.findOne({name : 'Test User'})
                .then((user) => {
                    var id = user.id
                    request(app)
                    .post('/api/stream')
                    .send(stream)
                    .set({'Authorization' : token})
                    .end((err,res) => {
                        expect(res.statusCode).to.equal(200)
                        expect(res.body.title).to.equal('Test Stream')
                        done()
                    })
                })
                
            })
    })

    it('throws an error when title is not provided', (done) => {
        request(app)
        .post('/api/user/register')
        .send(user)
        .end((err, res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body.auth).to.equal(true)
            var token = 'Bearer ' + res.body.token
            User.findOne({name : 'Test User'})
            .then((user) => {
                var id = user.id
                request(app)
                .post('/api/stream')
                .send(notitle)
                .set({'Authorization' : token})
                .end((err,res) => {
                    expect(res.statusCode).to.equal(401)
                    expect(res.body.Error).to.equal('No title provided')
                    done()
                })
            })
            
        })
    })

    it('throws and error when host is not provided', (done) => {
        request(app)
        .post('/api/user/register')
        .send(user)
        .end((err, res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body.auth).to.equal(true)
            var token = 'Bearer ' + res.body.token
            User.findOne({name : 'Test User'})
            .then((user) => {
                var id = user.id
                request(app)
                .post('/api/stream')
                .send(nohost)
                .set({'Authorization' : token})
                .end((err,res) => {
                    expect(res.statusCode).to.equal(401)
                    expect(res.body.Error).to.equal('No host provided')
                    done()
                })
            })
            
        })
    })

    it('sets timestamps on the object', (done) => {
        request(app)
        .post('/api/user/register')
        .send(user)
        .end((err, res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body.auth).to.equal(true)
            var token = 'Bearer ' + res.body.token
            User.findOne({name : 'Test User'})
            .then((user) => {
                var id = user.id
                request(app)
                .post('/api/stream')
                .send(stream)
                .set({'Authorization' : token})
                .end((err,res) => {
                    expect(res.statusCode).to.equal(200)
                    expect(res.body.createdAt).to.be.not.empty
                    done()
                })
            })
            
        })
    })
})