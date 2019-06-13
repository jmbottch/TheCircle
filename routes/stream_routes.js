const StreamController = require("../src/controllers/stream_controller");
const AuthController = require('../src/controllers/auth_controller')

module.exports = (app) => {
    //get a list of streams
    app.get('/api/stream/all', StreamController.getAll);

    //create a new stream
    app.post('/api/stream', StreamController.create);

    //deactivate a stream
    app.put('/api/stream/:id', StreamController.deactivateStream);

    //update a streams title with streamId in params and title in the body
    // app.put('/api/stream', StreamController.update);
};
