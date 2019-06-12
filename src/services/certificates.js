const crypto = require('crypto');
const verify = crypto.createVerify('SHA256');
const forge = require('node-forge');
const fs = require('fs');

var pki = forge.pki;
var passphrase = 'seeChange';
var PATH = process.cwd() + '/certificates';
// var key = fs.readFileSync(process.cwd() + '/certificates/private.pem', 'utf8');
// var pubkey = fs.readFileSync(process.cwd() + '/certificates/public.pem', 'utf8');
// TODO: authentication, x509 certificate
// Done: integrity

let rootCA = fs.readFileSync(PATH + '/circle.crt');
let rootKey = fs.readFileSync(PATH + '/rootkey.pem');

function generateCert(name) {
  const promise = new Promise((resolve, reject) => {
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
    // let keys = forge.pki.rsa.generateKeyPair(2048);
    // let cert = forge.pki.createCertificate();
    // cert.publicKey = keys.publicKey;
    // cert.serialNumber = '01';
    // cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    // let attrsIssuer = [{
    //         name: 'countryName',
    //         value: 'NL'
    //     }, {
    //         shortName: 'ST',
    //         value: 'Noord-Brabant'
    //       }, {
    //         name: 'localityName',
    //         value: 'Breda'
    //       }, {
    //         name: 'organizationName',
    //         value: 'The Circle'
    //       }, {
    //         shortName: 'OU',
    //         value: 'The Circle'
    //       }, {
    //         name: 'commonName',
    //         value: 'The Circle'
    //       },{
    //         shortName: 'E',
    //         value: 'thecircle@the.circle'
    //       }
    // ];
    // let attrsSubject = [{
    //     name: 'commonName',
    //     value: name
    //   }, {
    //     name: 'countryName',
    //     value: 'country'
    //   }, {
    //     shortName: 'ST',
    //     value: 'state'
    //   }, {
    //     name: 'localityName',
    //     value: 'city'
    //   }, {
    //     name: 'organizationName',
    //     value: 'The Circle'
    //   }, {
    //     shortName: 'OU',
    //     value: 'Users'
    //   }];

    //   let root = forge.pki.certificateFromPem(rootCA);
    //   let issuer = root.subject.attributes;
    //   cert.setIssuer(issuer);
    //   cert.setSubject(attrsSubject);

    //   cert.sign(pki.privateKeyFromPem(rootKey), forge.md.sha256.create());

    //   let priv = pki.privateKeyToPem(keys.privateKey);
    //   let pub = pki.publicKeyToPem(keys.publicKey);
    //   let pem = pki.certificateToPem(cert);

      // fs.writeFileSync(PATH + '/priv_key.pem', priv);
      // fs.writeFileSync(PATH + '/pub_key.pem', pub);
      // fs.writeFileSync(PATH + '/cert.pem.crt', pem);

      // res.status(200).json({
      //     private: priv,
      //     public: pub,
      //     cert: pem
      // });
}

function verifyMessage(req, res, next) {
    let author = req.body.author;
    let message = req.body.message;
    let pubKey = req.body.pubKey;
    let signature = req.body.signature;
    generateCert(author);
    console.log(req.body);
    let pub_key = Buffer.from(pubKey, 'base64');
    let public_key = pub_key.toString('utf8');
    console.log(public_key);

    let sign = Buffer.from(signature, 'base64');
    let signatureDecoded = sign.toString('utf8');
    console.log(signatureDecoded);

    let response = {
        author: author,
        message: message,
        pubKey: public_key,
        signature: signature
    };
    res.status(200).json(response);
}

// Backend magic
function decryptHash(req, res) {
    var buffer = req.body.signature;
    var buffered = Buffer.from(buffer, 'hex');
    console.log(buffered);
    var decrypted = crypto.publicDecrypt(pubkey, buffered);
    var response = {
        decrypted_buffer: decrypted.toString('hex'),
        decrypted_hash: decrypted.stoString('utf8'),
    };
    console.log({
        decrypted: decrypted,
        hash: decrypted.toString('utf8')
    });
    res.status(200).json(response);
}

// Test
function checkPath() {
    console.log(key);
    res.status(200).json(key);
}

module.exports = {
    verifyMessage,
    decryptHash,
    checkPath,
    generateCert,
};
