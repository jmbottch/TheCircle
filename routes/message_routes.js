const MessageController = require("../src/controllers/message_controller");
const AuthController = require('../src/controllers/auth_controller')

module.exports = (app) => {
    //get a list of messages
    app.get('/api/message/all', MessageController.getAll);

    app.get('/api/stream/:id/messages', MessageController.getStreamMessages)

    //post a new message
    app.post('/api/message', MessageController.create);
};