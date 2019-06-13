const ActivityController = require('../src/controllers/activity_controller')

module.exports = (app) => {
    app.get('/api/activity/all', ActivityController.getAll);
}
