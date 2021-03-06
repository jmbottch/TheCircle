const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config/auth_config');
const cert = require('../services/certificates');

function login(req, res) {
    console.log(req.body);
    let clientPublicKey = req.body.public_key;
    if(!req.body.name) {
        res.status(401).send({Error:'No name provided'})
    } else
    if(!req.body.password) {
        res.status(401).send({Error:'No Password provided'})
    } else {
        User.findOne({ name: req.body.name })
        .then(user => {
            console.log(user)
            if (!user) {
                res.status(400).json('User does not exists');
            } else {
                let encryptedPrivateKey = cert.encryptPrivateKey(clientPublicKey, user.privateKey);
                var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                res.status(401).send({ Error: 'Password does not match.' })
            }
            else {
                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });   
                res.status(200).send({ 
                    auth: true, 
                    token: token, 
                    userId: user._id,
                    username: user.name,
                    kudos: user.kudos,
                    private: encryptedPrivateKey,
                    public: user.publicKey,
                    cert: user.certificate,
                    profilePicture: user.profilePicture
                 });
            }
            }
        })
        .catch(error => {
            console.log(error);
            res.status(401).send({ Error: error });
        });
    }
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
        if (err) return res.status(401).send({ Error: 'Token is invalid.' })
        if (decoded) next();
    });
}

module.exports = {
    login,
    validateToken
}