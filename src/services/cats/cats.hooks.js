// const { authenticate } = require('feathers-authentication').hooks;
const axios = require('axios');
const uuid = require('uuid/v4');

module.exports = {
  before: {
    // all: [ authenticate('jwt') ],
    all: [],
    find: [],
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
        if (!hook.result || hook.result.length === 0) {
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
