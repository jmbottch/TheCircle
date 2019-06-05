const mongoose = require('mongoose')
const app = require('../server')
const request = require('supertest')
const chai = require('chai')
expect = chai.expect

const User = mongoose.model('user')

describe('the user_controller', () => {
    //test user
    user = new User({
        name: 'Test User',
        password: 'Password',
        admin: true
    })

    it('can register a new user', (done) => {
        request(app)
            .post('/api/user/register')
            .send(user)
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200)
                done()
            })
    })
    it('gives a user a token on register', (done) => {
        request(app)
            .post('/api/user/register')
            .send(user)
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200)
                expect(res.body.auth).to.equal(true)
                expect(res.body.token).to.not.be.empty
                done()
            })
    })
    it('can get a list of users', (done) => {
        request(app)
            .get('/api/users')
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.be.empty
                expect(res.body).to.be.an('Array')
                done()
            })
    })

    it('can update an existing user', (done) => { // not sure if needed
        request(app)
            .post('/api/user/register')
            .send(user)
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200)
                var token = 'Bearer ' + res.body.token
                User.findOne({ name: 'Test User' })
                    .then((foundUser) => {
                        request(app)
                            .put('/api/user/' + foundUser.id)
                            .send({ newPassword: 'newPass' }) //send the new password
                            .set({ 'Authorization': token })
                            .end(function (err, res) {
                                expect(res.statusCode).to.equal(200)
                                expect(res.body.Message).to.equal('password changed succesfully')
                                done()
                            })
                    })
            })
    })

    it('can delete an existing user', (done) => { // probably not needed
        request(app)
            .post('/api/user/register')
            .send(user)
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200)
                var token = 'Bearer ' + res.body.token
                User.findOne({ name: user.name })
                    .then((foundUser) => {
                        request(app)
                            .delete('/api/user/' + foundUser.id)
                            .set({ 'Authorization': token })
                            .end(function (err, res) {
                                expect(res.statusCode).to.equal(200)
                                expect(res.body.Message).to.equal('User succesfully removed.')
                                done()
                            })
                    })
            })
    })
})