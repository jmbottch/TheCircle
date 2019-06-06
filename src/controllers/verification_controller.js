const crypto = require('crypto');
const fs = require('fs');

var passphrase = 'seeChange';
var key = fs.readFileSync(process.cwd() + '/certificates/private.pem', 'utf8');
var pubkey = fs.readFileSync(process.cwd() + '/certificates/public.pem', 'utf8');

// TODO: authentication
// Done: integrity

function verifyMessage(req, res, next) {
    var message = req.body.message;
    var hmac = req.body.hmac;
    var verified = crypto.createHmac('sha256', passphrase).update(message).digest('hex');
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
    next();
}

// function createPrivateKey(req, res) {
//     var response;
//     var keyPair = crypto.generateKeyPair('rsa', {
//         modulusLength: 4096,
//         publicKeyEncoding: {
//             type: 'spki',
//             format: 'pem'
//         },
//         privateKeyEncoding: {
//             type: 'pkcs8',
//             format: 'pem',
//             cipher: 'aes-256-cbc',
//             passphrase: passphrase
//         }
//     }, (err, publicKey, privateKey) => {
//         if (err) res.send(400).json(err);
//         response = {
//             public_key: publicKey,
//             private_key: privateKey
//         };
//         res.status(200).json(response);
//     });
// }

// Implementation in frontend
function createHash(req, res, next) {
    var message = req.body.message;
    var hmac = crypto.createHmac('sha256', passphrase).update(message).digest('hex');
    res.status(200).json({
        message: message,
        hmac: hmac
    });
    next();
}

// Black Magic
function signHash(req, res) {
    var hmac = req.body.hmac;
    var bufferHmac = Buffer.from(hmac);
    var buffer = crypto.privateEncrypt(key, bufferHmac);
    console.log({buffer: buffer.toString('utf8')});
    res.send({buffer: buffer.toString('hex')});
}

// Backend magic
function decryptHash(req, res) {
    var buffer = req.body.signature;
    var buffered = Buffer.from(buffer, 'hex');
    console.log(buffered);
    var decrypted = crypto.publicDecrypt(pubkey, buffered);
    var response = {
        decrypted_buffer: decrypted.toString('hex'),
        decrypted_hash: decrypted.toString('utf8'),
    }
    console.log({
        decrypted: decrypted,
        hash: decrypted.toString('utf8')
    });
    res.status(200).json(response);
}

// Test
function checkPath(req, res) {
    console.log(key);
    res.status(200).json(key);
};

module.exports = {
    verifyMessage,
    // createPrivateKey,
    signHash,
    createHash,
    decryptHash,
    checkPath
}