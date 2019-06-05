const UserController = require('../src/controllers/user_controller');
const AuthController = require('../src/controllers/auth_controller');

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
};