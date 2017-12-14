const crypto = require('crypto');

const request = require('request-promise-native');
const errors = require('request-promise-native/errors');

const config = require('../config');

const { OrangeDataApiError } = require('./errors');

function signDocument(data, privateKey) {
  const sign = crypto.createSign('RSA-SHA256');
  sign.write(data);
  sign.end();
  return sign.sign(privateKey, 'base64');
}

const { host, port, baseUrl } = config;
const methods = ['get', 'post', 'put', 'patch', 'del'];

module.exports = class HttpClient {
  constructor({ apiUrl, ca, passphrase, key, cert, privateKey, rejectUnauthorized = true }) {
    const url = apiUrl || `https://${host}:${port}/${baseUrl}/`;

    this.request = request.defaults({
      baseUrl: `${url}`,
      headers: { 'cache-control': 'no-cache' },
      json: true,
      gzip: true,
      strictSSL: true,
      cert,
      key,
      passphrase,
      ca,
      rejectUnauthorized,
    });

    methods.forEach((method) => {
      this[method] = async (path, data, params) => {
        try {
          const sign = data && signDocument(JSON.stringify(data), privateKey);
          const options = {
            url: path,
            body: data,
            qs: params,
            headers: { 'X-Signature': sign },
          };
          const response = await this.request[method](options);
          return response;
        } catch (reason) {
          if (reason instanceof errors.StatusCodeError) {
            throw new OrangeDataApiError(reason);
          }
          throw reason;
        }
      };
    });
  }
};
