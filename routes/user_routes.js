const UserController = require('../src/controllers/user_controller');
const AuthController = require('../src/controllers/auth_controller');
const VerificationController = require('../src/controllers/verification_controller');

module.exports = (app) => {
    //
    //Login routes
    //
    //create a new user with 'name, password'
    app.post('/api/user/register', UserController.create);
    //create a token with 'name, password'
    app.post('/api/user/login', AuthController.login);
    
    //
    //User routes
    //
    //get all users
    app.get('/api/users/', UserController.getAll);
    //change password of an existing user with 'name, password, newPassword'
    app.put('/api/user/:id', AuthController.validateToken, UserController.editPassword);
    //remove a user from the database with 'name, password'
    app.delete('/api/user/:id', AuthController.validateToken, UserController.remove);
    // Message integrity check
    app.post('/api/createHash', AuthController.validateToken, VerificationController.createHash);
    app.post('/api/verifyHash', AuthController.validateToken, VerificationController.verifyMessage);
    // app.get('/api/createPrivkey', AuthController.validateToken, VerificationController.createPrivateKey);
    app.get('/api/path', VerificationController.checkPath);
    app.post('/api/sign', VerificationController.signHash);
    app.post('/api/decrypt', VerificationController.decryptHash);
};