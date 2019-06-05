const crypto = require('crypto');

var privateKey = 'seeChange';

function verifyMessage(req, res) {
    var message = req.body.message;
    var hmac = req.body.hmac;
    var verified = crypto.createHmac('sha256', privateKey).update(message).digest('hex');
    var verification = hmac == verified;
    var response = {
        original: message,
        hmac: hmac,
        verification: verified,
        tampered: null
    }
    if (verification) {
        response.tampered = false
        res.status(200).json(response)
    } else {
        response.tampered = true
        res.status(200).json(response);
    }
}

// Implement in frontend
function createHash(req, res) {
    var message = req.body.message;
    var hmac = crypto.createHmac('sha256', privateKey).update(message).digest('hex');
    res.status(200).json({
        message: message,
        hmac: hmac
    });
}

module.exports = {
    verifyMessage,
    createHash
}