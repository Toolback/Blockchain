const routes = require('next-routes')();

routes
.add('/campaigns/new', '/campaigns/new')
.add('/campaigns/:kickstarter', '/campaigns/show')
.add('/campaigns/:kickstarter/requests', '/campaigns/requests/index')
.add('/campaigns/:kickstarter/requests/new', 'campaigns/requests/new');

module.exports = routes;