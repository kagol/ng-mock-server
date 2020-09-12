const PROXY_CONFIG = {
  '/v1': {
    target: 'http://localhost:9090/v1'
  }
};

module.exports = PROXY_CONFIG;
