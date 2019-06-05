const MessageController = require("../src/controllers/message_controller");

module.exports = (app) => {
    app.get('/messages', MessageController.getAll);
    app.post('/messages', MessageController.post);
};