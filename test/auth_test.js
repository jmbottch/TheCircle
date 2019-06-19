const mongoose = require('mongoose')
const app = require('../server')
const request = require('supertest')
const chai = require('chai')
expect = chai.expect

const User = mongoose.model('user')

describe('the auth_controller can', () => {
     //test user
     user = new User({
        name: 'Test User',
        password: 'Password',
        admin: true
    })

    login = new User({
        name:'Test User',
        password:'Password'
    })

    noname = new User({
        password: 'Password'
    })
    nopass = new User({
        name:'Test User'
    })

    it('can log in a user', (done) => {
        request(app)
        .post('/api/user/register')
        .send(user)
        .end(function(err,res) {
            expect(res.statusCode).to.equal(200)
            request(app)
            .post('/api/user/login')
            .send(login)
            .end(function (err,res) {
                var token = res.body.token
                expect(res.statusCode).to.equal(200)
                expect(res.body.auth).to.equal(true)
                expect(res.body.token).to.equal(token)
                done()
            })
        })
    })

    it('throws an error when no name is provided', (done) => {
        request(app)
        .post('/api/user/register')
        .send(user)
        .end(function(err,res) {
            expect(res.statusCode).to.equal(200)
            request(app)
            .post('/api/user/login')
            .send(noname)
            .end(function(err,res) {
                expect(res.statusCode).to.equal(401)
                expect(res.body.Error).to.equal('No name provided')
                done()
            })
            
        })
    })

    it('throws an error when no password is provided', (done) => {
        request(app)
        .post('/api/user/register')
        .send(user)
        .end(function(err,res) {
            expect(res.statusCode).to.equal(200)
            request(app)
            .post('/api/user/login')
            .send(nopass)
            .end(function(err,res) {
                expect(res.statusCode).to.equal(401)
                expect(res.body.Error).to.equal('No Password provided')
                done()
            })
            
        })
    })
})