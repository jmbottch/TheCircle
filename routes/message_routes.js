const MessageController = require("../src/controllers/message_controller");
const AuthController = require('../src/controllers/auth_controller')

module.exports = (app) => {
    //get a list of messages
    app.get('/api/messages', MessageController.getAll);

    //post a new message
    app.post('/api/messages', MessageController.post);
};