// Development specific configuration
// ==================================
const development = {
  host: process.env.OD_HOST || 'apip.orangedata.ru',
  port: process.env.OD_PORT || 12001,
  baseUrl: process.env.OD_BASE_URL || 'api/v2',
};

module.exports = development;
