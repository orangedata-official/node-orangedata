const NODE_ENV = process.env.NODE_ENV || 'development';
let environment = null;
try {
  environment = require(`./${NODE_ENV}.js`); // eslint-disable-line
} catch (e) {
  // who cares
}

// All configurations will extend these options
// ============================================
const all = {
  host: process.env.OD_HOST || 'api.orangedata.ru',
  port: process.env.OD_PORT || 12003,
  baseUrl: process.env.OD_BASE_URL || 'api/v2',
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = Object.assign(all, environment || {});
