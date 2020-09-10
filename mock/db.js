var Mock = require('mockjs');

const CARDS = Mock.mock({
  'error': null,
  'status': 'success',
  'result': [
    {
      'subject': '@title'
    }
  ]
});

const API = () => ({
  'cards': CARDS,
});

module.exports = API;
