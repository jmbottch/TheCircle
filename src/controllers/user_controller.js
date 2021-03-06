const User = require('../models/user');
const StreamModel = require('../models/stream');
const Activity = require('../models/activity')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/auth_config');
const cert = require('../services/certificates');

function getAll(req, res) {
    User.find({}, { password: 0, admin: 0, __v: 0 })
        .then(users => {
            res.status(200).send(users);
        })
        .catch(err => {
            res.status(401).send(err);
        })
}

function getSingle(req, res) {
    User.findById(req.params.id)
    .populate('activities messages')
    .then(user => {
        res.status(200).send(user)
    })
    .catch(err => {
        res.status(401).send(err)
    })
}

function create(req, res) {
    if (!req.body.password) {
        res.status(401).send({ Error: 'No password provided' })
    } else {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
        cert.generateCert(req.body.name)
            .then((data) => {
                let user = {
                    name: req.body.name,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                    privateKey: data.private,
                    publicKey: data.public,
                    certificate: data.cert
                };
                User.create(user)
                    .then(madeUser => {
                        var token = jwt.sign({ id: madeUser._id }, config.secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).send({ Message: "User created succesfully.", auth: true, token: token, userId: madeUser._id });
                    })
                    .catch((err) => {
                        if (err.name == 'MongoError' && err.code == 11000) {
                            res.status(401).send({ Error: 'Username is taken.' });
                        }
                        else {
                            res.status(401).send({ err });
                        }
                    });
            })

    }

};

function editPassword(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);
    User.findById(req.params.id)
        .then((user) => {
            if (user === null) {
                res.status(401).send({ Error: 'User does not exist.' })
            }
            else {
                user.set({ password: hashedPassword })
                user.save()
                    .then(() => res.status(200).send({ Message: "password changed succesfully" }))
                    .catch((err) => res.status(401).send(err));
            }
        })
        .catch((err) => {
            res.status(401).send({ err });
        });
};

function remove(req, res) {
    User.findById(req.params.id)
        .then(user => {
            if (user === null) {
                res.status(401).send({ Error: 'To be deleted does not exist.' })
            }
            else {
                user.delete()
                    .then(() => {
                        res.status(200).send({ Message: 'User succesfully removed.' })
                    })
                    .catch((err) => res.status(401).send(err))
            }
        });
};

function addActivity(input, user) {
    console.log(user)
    User.findById(req.body.host)
        .then(user => {
            if (user === null) {
                res.status(401).send({ Error: 'User does not exist.' })
            }
            else {
                user.set({ activity: input })
                user.save()
                    .then(() => res.status(200).send({ Message: 'Activity succesfully added.' }))
                    .catch((err) => res.status(401).send(err))
            }
        })
}

module.exports = {
    getAll,
    create,
    editPassword,
    remove,
    addActivity,
    getSingle
}