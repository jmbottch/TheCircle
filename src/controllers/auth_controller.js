const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config/auth_config');

function login(req, res) {
    User.findOne({ name: req.body.name })
        .then(user => {
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                res.status(401).send({ Error: 'Password does not match.' })
            }
            else {
                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token });
            }
        })
        .catch(error => {
            res.status(401).send({ Error: error });
        });
}

function validateToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ Error: 'No token provided.' })
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).send({ Error: 'No token provided.' })
    }
    jwt.verify(token, config.secret, function (err, decoded) {
        console.log(decoded)
        if (err) return res.status(401).send({ Error: 'Token is invalid.' })
        if (decoded) next();
    });
}

function isAdmin(req, res, next) {
    User.findById({ _id: req.params.id })
        .then(founduser => {
            console.log(founduser);
            if (founduser.admin) {
                return res.status(200).send("Gebruiker is een administrator.")
            } else {
                return res.status(401).send({ Error: 'Gebruiker is geen administrator.' })
            }
        })
        .catch(() => {
            return res.status(401).send({ Error: 'Gebruiker niet gevonden.' })
        });
}

function validateAdmin(req, res, next) {
    User.findOne({ name: req.headers.name })
        .then(foundUser => {
            //console.log("admin = " + JSON.parse(foundUser.admin));
            if (foundUser.admin) next();
            else return res.status(401).send({ Error: 'Gebruiker is geen administrator.' });
        })
        .catch(() => {
            return res.status(401).send({ Error: 'Gebruiker niet gevonden.' })
        });
}

module.exports = {
    login,
    validateToken,
    isAdmin,
    validateAdmin
}