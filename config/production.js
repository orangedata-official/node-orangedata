// Production specific configuration
// =================================
const production = {
  host: process.env.OD_HOST || 'api.orangedata.ru',
  port: process.env.OD_PORT || 12003,
  baseUrl: process.env.OD_BASE_URL || 'api/v2',
};

module.exports = production;
