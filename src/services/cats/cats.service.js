// Initializes the `cats` service on path `/cats`
const createService = require('feathers-nedb');
const createModel = require('../../models/cats.model');
const hooks = require('./cats.hooks');
const filters = require('./cats.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'cats',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/cats', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('cats');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
