const StreamController = require("../src/controllers/stream_controller");
const AuthController = require('../src/controllers/auth_controller')

module.exports = (app) => {
    //get a list of streams
    app.get('/api/stream/all', StreamController.getAll);

    //create a new stream
    app.post('/api/stream', StreamController.create);

    //update a streams title with streamId in params and title in the body
    app.put('/api/stream', StreamController.update);

    //get amount of viewers for a stream
    app.get('/api/stream/:id/viewers', StreamController.getViewers);
};
