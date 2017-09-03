// const { authenticate } = require('feathers-authentication').hooks;
const axios = require('axios');
const uuid = require('uuid/v4');

module.exports = {
  before: {
    // all: [ authenticate('jwt') ],
    all: [],
    find: [
      function (hook) {
        if (hook.params.query.since) {
          hook.params.query = { uploadedTryAt: { gte: hook.params.query.since } };
        }
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      function (hook) {
        if (hook.result.total <= hook.result.skip && !hook.params.query.uploadedTryAt) {
          let promises = [];

          for (let i = 0; i < 5; i++) {
            promises.push(axios.get('http://thecatapi.com/api/images/get?format=src'));
          }

          return Promise.all(promises)
            .then((responses) => {
              hook.result = responses.map((response) => {
                const uuidGenerated = uuid();

                return {
                  preview: response.request._redirectable._currentUrl,
                  uuid: uuidGenerated,
                };
              });
            });
        } else {
          hook.result = hook.result.data;
        }
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
