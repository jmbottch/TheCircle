const forge = require('node-forge');
const fs = require('fs');

var pki = forge.pki;
var passphrase = 'seeChange';
var PATH = process.cwd() + '/certificates';
// var key = fs.readFileSync(process.cwd() + '/certificates/private.pem', 'utf8');
// var pubkey = fs.readFileSync(process.cwd() + '/certificates/public.pem', 'utf8');

// Done: integrity, authentication, x509 certificate
// TODO: backend to frontend signature

let rootCA = fs.readFileSync(PATH + '/circle.crt');
let rootKey = fs.readFileSync(PATH + '/rootkey.pem');
let forge_key = forge.pki.privateKeyFromPem(rootKey);


function generateCert(name) {
  const promise = new Promise((resolve, reject) => {
    if (!name) reject('Error');
    let keys = forge.pki.rsa.generateKeyPair(2048);
    let cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    let attrsIssuer = [{
        name: 'countryName',
            value: 'NL'
        }, {
            shortName: 'ST',
            value: 'Noord-Brabant'
          }, {
            name: 'localityName',
            value: 'Breda'
          }, {
            name: 'organizationName',
            value: 'The Circle'
          }, {
            shortName: 'OU',
            value: 'The Circle'
          }, {
            name: 'commonName',
            value: 'The Circle'
          },{
            shortName: 'E',
            value: 'thecircle@the.circle'
          }
    ];
    let attrsSubject = [{
        name: 'commonName',
        value: name
      }, {
        name: 'countryName',
        value: 'country'
      }, {
        shortName: 'ST',
        value: 'state'
      }, {
        name: 'localityName',
        value: 'city'
      }, {
        name: 'organizationName',
        value: 'The Circle'
      }, {
        shortName: 'OU',
        value: 'Users'
      }];

      let root = forge.pki.certificateFromPem(rootCA);
      let issuer = root.subject.attributes;
      cert.setIssuer(issuer);
      cert.setSubject(attrsSubject);

      cert.sign(pki.privateKeyFromPem(rootKey), forge.md.sha256.create());

      let priv = pki.privateKeyToPem(keys.privateKey);
      let pub = pki.publicKeyToPem(keys.publicKey);
      let pem = pki.certificateToPem(cert);

      let object = {
        private: priv,
        public: pub,
        cert: pem
      };
      resolve(object);
  });
  return promise;
}

function verifyMessage(signature, message, cert) {
  const msgD = forge.md.sha256.create();
  msgD.update(message);
  const certi = forge.pki.certificateFromPem(cert);
  const sigHex = forge.util.hexToBytes(signature);
  let verified = certi.publicKey.verify(msgD.digest().bytes(), sigHex);
  return verified;
}

function encryptPrivateKey(client, user) {
  let encryptKey = pki.publicKeyFromPem(client);
  let userPrivateKey = pki.privateKeyFromPem(user);
  let encryptUserPrivateKey = pki.encryptRsaPrivateKey(userPrivateKey, passphrase);
  let encrypted = encryptKey.encrypt(passphrase);
  // console.log(encryptPrivateKey);
  let response = {
    e: encrypted,
    eRsa: encryptUserPrivateKey
  }
  return response;
}

function signMessage(msg) {
  const messageDigest = forge.md.sha256.create();
  messageDigest.update(msg);
  const signature = forge_key.sign(messageDigest);
  const signatureHex = forge.util.bytesToHex(signature);
  return signatureHex;
}

function checkStreamMessages(messages) {
  const digestPromise = new Promise((resolve, reject) => {
    if (!messages) reject('Error');
    let streamMessagesDigest = [];
    for (var i =0; i < messages.length; i++) {
      console.log(messages[i]);
      let msg = messages[i].message;
      let signatureHex = signMessage(msg);
      let digestedMessage = {
        _id: messages[i]._id,
        authorname: messages[i].authorname,
        author: messages[i].author,
        message: msg,
        signatureHex: signatureHex,
        createdAt: messages[i].createdAt,
        updatedAt: messages[i].updatedAt
      }
      streamMessagesDigest.push(digestedMessage);
    }
    console.log(streamMessagesDigest);
    resolve(streamMessagesDigest);
  });
  return digestPromise;
}

// legacy code
    // let author = req.body.author;
    // let authorname = req.body.authorname;
    // let message = req.body.message;
    // let signature = req.body.signature;
    // console.log(req.body);
    // let pub_key = Buffer.from(pubKey, 'base64');
    // let public_key = pub_key.toString('utf8');
    // console.log(public_key);

    // let sign = Buffer.from(signature, 'base64');
    // let signatureDecoded = sign.toString('utf8');
    // console.log(signatureDecoded);

    // let response = {
    //     author: author,
    //     message: message,
    //     pubKey: public_key,
    //     signature: signature
    // };
    // res.status(200).json(response);

// Backend magic
// function decryptHash(req, res) {
//     var buffer = req.body.signature;
//     var buffered = Buffer.from(buffer, 'hex');
//     console.log(buffered);
//     var decrypted = crypto.publicDecrypt(pubkey, buffered);
//     var response = {
//         decrypted_buffer: decrypted.toString('hex'),
//         decrypted_hash: decrypted.stoString('utf8'),
//     };
//     console.log({
//         decrypted: decrypted,
//         hash: decrypted.toString('utf8')
//     });
//     res.status(200).json(response);
// }

// Test
function checkPath() {
    console.log(key);
    res.status(200).json(key);
}

module.exports = {
    verifyMessage,
    checkPath,
    generateCert,
    encryptPrivateKey,
    checkStreamMessages,
};
