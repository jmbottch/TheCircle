const mongoose = require('mongoose')
const app = require('../server')
const request = require('supertest')
const chai = require('chai')
expect = chai.expect

const User = mongoose.model('user')
const Message = mongoose.model('message')

describe('the message_controller', () => {


    var user = new User({
        name: 'Test User',
        password: 'Password',
        admin: true
    })

    var msg = new Message({
        author: 'Test Message',
        message: 'Content',
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
                    .get('/api/users')
                    .end(function (err, res) {
                        User.findOne({ name: user.name })
                            .then((found) => {
                                request(app)
                                    .post('/api/message')
                                    .send({
                                        "authorname": "qwe",
                                        "author": "5d076656d6e7b42208b97d1f",
                                        "message": "message",
                                        "signature": "660290fad95c1c975ade475d799fe81ddac8de6cc9b950bb2803daccf937af035798f0f3774bf831073df8afab927986285e722318cc44049e5074580bf663e06d99fd44abbf55d47f4a8f6e625544ed36af7e6339b1408b50138f9a34e91e1a788b21a07b0e997c9aefb15c47cb54b3a50801c8c46803bd4aea577bd314b30d9013f8f51bf71fd12b1499813d7e570256c3317bdcb2f23dc4b078009ba8e85466d41374f2d6f0c66dd87d28e8d1f354937950d1487c73a3d0491518c4e1d61512fdff816cb30133c9accfd7f2a0ab911c333bb9322ffc70d9a220568e6e01fed882d64542fa8d110e0c6624501009b88450fbc031a6468c6dc8b5197a55e90a",
                                        "certificate": "-----BEGIN CERTIFICATE-----\r\nMIIDbzCCAlegAwIBAgIBATANBgkqhkiG9w0BAQsFADCBkTELMAkGA1UEBhMCTkwx\r\nFjAUBgNVBAgMDU5vb3JkLUJyYWJhbnQxDjAMBgNVBAcMBUJyZWRhMRMwEQYDVQQK\r\nDApUaGUgQ2lyY2xlMRIwEAYDVQQLDAlUaGVDaXJjbGUxEjAQBgNVBAMMCXRoZWNp\r\ncmNsZTEdMBsGCSqGSIb3DQEJARYOdGhlQGNpcmNsZS5jb20wHhcNMTkwNjE3MTAw\r\nNzE3WhcNMjAwNjE3MTAwNzE3WjBkMQwwCgYDVQQDEwNxd2UxEDAOBgNVBAYTB2Nv\r\ndW50cnkxDjAMBgNVBAgTBXN0YXRlMQ0wCwYDVQQHEwRjaXR5MRMwEQYDVQQKEwpU\r\naGUgQ2lyY2xlMQ4wDAYDVQQLEwVVc2VyczCCASIwDQYJKoZIhvcNAQEBBQADggEP\r\nADCCAQoCggEBALikTqUBH0IXoNCStcBGHB4HP/HdEomQ0mCt5eViexbbtxxC5SBC\r\nBEVoUY1bpeoJcKt80GYvoWZIpHnbsf11k2n9fleCekzSuMVMG373hI/mkhYxUWEH\r\nLYxP4GjwzULRC/9yNS/fVD6duGBK/MDOvBQd5n88REkPeCbF05eeJ4Z8N+MdxRWU\r\nW+z9IUBVGQ2q99iaH7kD3sJq/0Kwm6a1fIB3KtjB5ggX5wEsA0DZteg4i4rRxpS1\r\nBP80Rexy0FYo6N16QGww19DTcw8B6ERZv9vX+Ran1RJJMgJfuvj6QsH+jWApIzGs\r\nHLHNzBR0sX26J6BflqY2QE5njBewjAJltLsCAwEAATANBgkqhkiG9w0BAQsFAAOC\r\nAQEApypMB3dHx054HoWfdom2F45dqu61iwXYEpzfIyOd5N2cwGHZCfBdfsjQjTuG\r\naHAaW3sUhxce2wYVKA49TYo5GOLnYk/fnQV+ZMxpJXNlauuUproa7harIWrq/Vtu\r\nld/Z1XDK0Ka9MonkLn9m9JVzA0oOsnALaCIAwuiqR+3Z3yWYAz06FKw6NcHOkcuS\r\nWOAvFc8sXQktCBIrH/YAIzMbDa+iOdPO4Cs2xvog3dg7JgNxLriPgmu6YJhPAhs2\r\nnMIQl+G6lNpjnPBsGrYdY+uzhBKIA6z55sOBg07Cu68GpS2SRTsW4zhr1obCVXJf\r\nexBqV1QLywiBESh5sRnYFsO+nA==\r\n-----END CERTIFICATE-----\r\n",
                                        "host": found.id
                                    })
                                    .set({ "Authorization": token })
                                    .end(function (err, res) {
                                        expect(res.statusCode).to.equal(200)
                                        expect(res.body.Message).to.equal('Message saved')
                                        done()
                                    })
                            })
                    })

            })
    })

    it('throws an error when not logged in on posting a message', (done) => {//verify certificate still needs error handling
        request(app)
            .post('/api/message/')
            .send(msg)
            .end(function (err, res) {
                expect(res.statusCode).to.equal(401)
                expect(res.body.Error).to.equal('Error in key authentication')
                done()
            })
    })

    it('throws an error when message-author is not provided', (done) => { 
        request(app)
            .post('/api/user/register')
            .send(user)
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200)
                expect(res.body.auth).to.equal(true)
                var token = 'Bearer ' + res.body.token
                request(app)
                    .post('/api/message')
                    .send({
                        "authorname": "qwe",
                        "message": "message",
                        "signature": "660290fad95c1c975ade475d799fe81ddac8de6cc9b950bb2803daccf937af035798f0f3774bf831073df8afab927986285e722318cc44049e5074580bf663e06d99fd44abbf55d47f4a8f6e625544ed36af7e6339b1408b50138f9a34e91e1a788b21a07b0e997c9aefb15c47cb54b3a50801c8c46803bd4aea577bd314b30d9013f8f51bf71fd12b1499813d7e570256c3317bdcb2f23dc4b078009ba8e85466d41374f2d6f0c66dd87d28e8d1f354937950d1487c73a3d0491518c4e1d61512fdff816cb30133c9accfd7f2a0ab911c333bb9322ffc70d9a220568e6e01fed882d64542fa8d110e0c6624501009b88450fbc031a6468c6dc8b5197a55e90a",
                        "certificate": "-----BEGIN CERTIFICATE-----\r\nMIIDbzCCAlegAwIBAgIBATANBgkqhkiG9w0BAQsFADCBkTELMAkGA1UEBhMCTkwx\r\nFjAUBgNVBAgMDU5vb3JkLUJyYWJhbnQxDjAMBgNVBAcMBUJyZWRhMRMwEQYDVQQK\r\nDApUaGUgQ2lyY2xlMRIwEAYDVQQLDAlUaGVDaXJjbGUxEjAQBgNVBAMMCXRoZWNp\r\ncmNsZTEdMBsGCSqGSIb3DQEJARYOdGhlQGNpcmNsZS5jb20wHhcNMTkwNjE3MTAw\r\nNzE3WhcNMjAwNjE3MTAwNzE3WjBkMQwwCgYDVQQDEwNxd2UxEDAOBgNVBAYTB2Nv\r\ndW50cnkxDjAMBgNVBAgTBXN0YXRlMQ0wCwYDVQQHEwRjaXR5MRMwEQYDVQQKEwpU\r\naGUgQ2lyY2xlMQ4wDAYDVQQLEwVVc2VyczCCASIwDQYJKoZIhvcNAQEBBQADggEP\r\nADCCAQoCggEBALikTqUBH0IXoNCStcBGHB4HP/HdEomQ0mCt5eViexbbtxxC5SBC\r\nBEVoUY1bpeoJcKt80GYvoWZIpHnbsf11k2n9fleCekzSuMVMG373hI/mkhYxUWEH\r\nLYxP4GjwzULRC/9yNS/fVD6duGBK/MDOvBQd5n88REkPeCbF05eeJ4Z8N+MdxRWU\r\nW+z9IUBVGQ2q99iaH7kD3sJq/0Kwm6a1fIB3KtjB5ggX5wEsA0DZteg4i4rRxpS1\r\nBP80Rexy0FYo6N16QGww19DTcw8B6ERZv9vX+Ran1RJJMgJfuvj6QsH+jWApIzGs\r\nHLHNzBR0sX26J6BflqY2QE5njBewjAJltLsCAwEAATANBgkqhkiG9w0BAQsFAAOC\r\nAQEApypMB3dHx054HoWfdom2F45dqu61iwXYEpzfIyOd5N2cwGHZCfBdfsjQjTuG\r\naHAaW3sUhxce2wYVKA49TYo5GOLnYk/fnQV+ZMxpJXNlauuUproa7harIWrq/Vtu\r\nld/Z1XDK0Ka9MonkLn9m9JVzA0oOsnALaCIAwuiqR+3Z3yWYAz06FKw6NcHOkcuS\r\nWOAvFc8sXQktCBIrH/YAIzMbDa+iOdPO4Cs2xvog3dg7JgNxLriPgmu6YJhPAhs2\r\nnMIQl+G6lNpjnPBsGrYdY+uzhBKIA6z55sOBg07Cu68GpS2SRTsW4zhr1obCVXJf\r\nexBqV1QLywiBESh5sRnYFsO+nA==\r\n-----END CERTIFICATE-----\r\n",
                        "host": user.id
                    })
                    .set({ 'Authorization': token })
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(401)
                        expect(res.body.Error).to.equal('No author provided')
                        done()
                    })
            })
    })

    it('throws an error when message-content is not provided', (done) => {
        request(app)
            .post('/api/user/register')
            .send(user)
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200)
                expect(res.body.auth).to.equal(true)
                var token = 'Bearer ' + res.body.token
                request(app)
                    .post('/api/message')
                    .send({
                        "authorname": "qwe",
                        "author": "5d076656d6e7b42208b97d1f",
                        "signature": "660290fad95c1c975ade475d799fe81ddac8de6cc9b950bb2803daccf937af035798f0f3774bf831073df8afab927986285e722318cc44049e5074580bf663e06d99fd44abbf55d47f4a8f6e625544ed36af7e6339b1408b50138f9a34e91e1a788b21a07b0e997c9aefb15c47cb54b3a50801c8c46803bd4aea577bd314b30d9013f8f51bf71fd12b1499813d7e570256c3317bdcb2f23dc4b078009ba8e85466d41374f2d6f0c66dd87d28e8d1f354937950d1487c73a3d0491518c4e1d61512fdff816cb30133c9accfd7f2a0ab911c333bb9322ffc70d9a220568e6e01fed882d64542fa8d110e0c6624501009b88450fbc031a6468c6dc8b5197a55e90a",
                        "certificate": "-----BEGIN CERTIFICATE-----\r\nMIIDbzCCAlegAwIBAgIBATANBgkqhkiG9w0BAQsFADCBkTELMAkGA1UEBhMCTkwx\r\nFjAUBgNVBAgMDU5vb3JkLUJyYWJhbnQxDjAMBgNVBAcMBUJyZWRhMRMwEQYDVQQK\r\nDApUaGUgQ2lyY2xlMRIwEAYDVQQLDAlUaGVDaXJjbGUxEjAQBgNVBAMMCXRoZWNp\r\ncmNsZTEdMBsGCSqGSIb3DQEJARYOdGhlQGNpcmNsZS5jb20wHhcNMTkwNjE3MTAw\r\nNzE3WhcNMjAwNjE3MTAwNzE3WjBkMQwwCgYDVQQDEwNxd2UxEDAOBgNVBAYTB2Nv\r\ndW50cnkxDjAMBgNVBAgTBXN0YXRlMQ0wCwYDVQQHEwRjaXR5MRMwEQYDVQQKEwpU\r\naGUgQ2lyY2xlMQ4wDAYDVQQLEwVVc2VyczCCASIwDQYJKoZIhvcNAQEBBQADggEP\r\nADCCAQoCggEBALikTqUBH0IXoNCStcBGHB4HP/HdEomQ0mCt5eViexbbtxxC5SBC\r\nBEVoUY1bpeoJcKt80GYvoWZIpHnbsf11k2n9fleCekzSuMVMG373hI/mkhYxUWEH\r\nLYxP4GjwzULRC/9yNS/fVD6duGBK/MDOvBQd5n88REkPeCbF05eeJ4Z8N+MdxRWU\r\nW+z9IUBVGQ2q99iaH7kD3sJq/0Kwm6a1fIB3KtjB5ggX5wEsA0DZteg4i4rRxpS1\r\nBP80Rexy0FYo6N16QGww19DTcw8B6ERZv9vX+Ran1RJJMgJfuvj6QsH+jWApIzGs\r\nHLHNzBR0sX26J6BflqY2QE5njBewjAJltLsCAwEAATANBgkqhkiG9w0BAQsFAAOC\r\nAQEApypMB3dHx054HoWfdom2F45dqu61iwXYEpzfIyOd5N2cwGHZCfBdfsjQjTuG\r\naHAaW3sUhxce2wYVKA49TYo5GOLnYk/fnQV+ZMxpJXNlauuUproa7harIWrq/Vtu\r\nld/Z1XDK0Ka9MonkLn9m9JVzA0oOsnALaCIAwuiqR+3Z3yWYAz06FKw6NcHOkcuS\r\nWOAvFc8sXQktCBIrH/YAIzMbDa+iOdPO4Cs2xvog3dg7JgNxLriPgmu6YJhPAhs2\r\nnMIQl+G6lNpjnPBsGrYdY+uzhBKIA6z55sOBg07Cu68GpS2SRTsW4zhr1obCVXJf\r\nexBqV1QLywiBESh5sRnYFsO+nA==\r\n-----END CERTIFICATE-----\r\n",
                        "host": user.id
                    })
                    .set({ 'Authorization': token })
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(401)
                        expect(res.body.Error).to.equal('No content provided')
                        done()
                    })
            })
    })
})