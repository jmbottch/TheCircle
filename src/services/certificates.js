const crypto = require('crypto');
const verify = crypto.createVerify('SHA256');
const forge = require('node-forge');
const fs = require('fs');

var pki = forge.pki;
var passphrase = 'seeChange';
var PATH = process.cwd() + '/certificates';
// var key = fs.readFileSync(process.cwd() + '/certificates/private.pem', 'utf8');
// var pubkey = fs.readFileSync(process.cwd() + '/certificates/public.pem', 'utf8');

// Done: integrity, authentication, x509 certificate

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
}

function tlsConnection(app) {
  app.get('/api/private', encryptedConnection);
}

function encryptedConnection(req, res) {
  res.status(200).json('test');
}

function verifyMessage(signature, message, cert) {
  const msgD = forge.md.sha256.create();
  msgD.update(message);
  const certi = forge.pki.certificateFromPem(cert);
  let verified = certi.publicKey.verify(msgD.digest().bytes(), signature);
  return verified;
}

function encryptCredentialReversed(cred) {
  var key = forge.random.getBytesSync(16);
  var iv = forge.random.getBytesSync(16);

  let keyHex = forge.util.bytesToHex(key);
  let ivHex = forge.util.bytesToHex(iv);
}

function decryptCredentialReversed(cred) {
  
}

function encryptCredential(cred) {
  console.log(cred);
  var key = forge.random.getBytesSync(16);
  var iv = forge.random.getBytesSync(16);

  let keyHex = forge.util.bytesToHex(key);
  let ivHex = forge.util.bytesToHex(iv);

  // console.log({
  //   cred: cred,
  //   key: keyHex,
  //   keyBin: key,
  //   keyDec: forge.util.hexToBytes(keyHex),
  //   keyLen: keyHex.length,
  //   iv: ivHex,
  //   ivBin: iv,
  //   ivDec: forge.util.hexToBytes(ivHex),
  //   ivLen: ivHex.length
  // });

  let credBytes = forge.util.createBuffer(cred);
  console.log(credBytes);

  var cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({ iv: iv });
  cipher.update(credBytes);
  cipher.finish();
  var encryptedHex = cipher.output.toHex();

  // let encLen = encryptedString.length;
  // console.log(encLen);
  // let halfWay = encLen / 2;
  // let splitEnc = encryptedString.substring(0, halfWay);
  // let splitEnc2 = encryptedString.substring(halfWay, encLen);
  // console.log(splitEnc);
  // console.log(splitEnc2);
  // let reversedEnc = splitEnc2.concat(splitEnc);
  // let reversedEncryption = splitEnc2 + splitEnc;

  // console.log({
  //   k: keyHex,
  //   i: ivHex,
  //   e: encryptedHex,
  //   re: reversedEnc,
  //   f1: splitEnc,
  //   f2: splitEnc2
  // });

  // let response = { 
  //   k: keyHex,
  //   i: ivHex,
  //   e: encryptedHex
  // };

  let response = keyHex.concat(ivHex, [encryptedHex]);
  // decryptMessage(response);
  return response;
}

function decryptMessage(response) {
  // console.log(response);
  // let keyBytes = forge.util.hexToBytes(response.k);
  // let ivBytes = forge.util.hexToBytes(response.i);
  // let encBytes = forge.util.hexToBytes(response.e);
  // console.log({
  //   enc: encBytes
  // });

  let keyHex = response.substring(0, 32);
  let ivHex = response.substring(32, 64);
  let encHex = response.substring(64, response.length);

  let keyBytes = forge.util.hexToBytes(keyHex);
  let ivBytes = forge.util.hexToBytes(ivHex);
  let encBytes = forge.util.hexToBytes(encHex);

  let decipher = forge.cipher.createDecipher('AES-CBC', keyBytes);
  decipher.start({ iv: ivBytes });
  decipher.update(forge.util.createBuffer(encBytes));
  console.log(decipher.finish());
  let deciphered = decipher.output;
  console.log({
    dec: deciphered
  });
  // let decipher = forge.cipher.createDecipher('AES-CBC', )
}
  // const algorithm = 'aes-192-cbc';
  // const password = 'testthisshit';

  // const key = crypto.scryptSync(password, 'salt', 24);
  // const iv = Buffer.alloc(16, 0);

  // const cipher = crypto.createCipher(algorithm, key, iv);

  // let encrypted = '';
  // cipher.on('readable', () => {
  //   let chunk;
  //   while (null !== (chunk = cipher.read())) {
  //     encrypted += chunk.toString('hex');
  //   }
  // });
  // cipher.on('end', () => {
  //   console.log(encrypted);
  // });
  // cipher.write(cred);
  // cipher.end();
  // return encrypted;

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
    encryptCredential,
    tlsConnection,
    encryptedConnection
};
