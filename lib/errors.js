/* eslint-disable max-classes-per-file */
const ORANGE_API_ERRORS = {
  401: 'Клиентский сертификат не прошел проверку',
  409: 'Чек с данным идентификатором уже был создан в системе',
  400: 'Некорректный запрос',
  503: 'Очередь документов переполнена, повторите попытку позже',
};

class OrangeDataError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = 'OrangeDataError';
    this.errors = errors;
    Error.captureStackTrace(this, OrangeDataError);
  }
}

class OrangeDataValidationError extends OrangeDataError {
  constructor(errors) {
    const flattened = Object.entries(errors).map(([key, error]) => `${key}: ${error}`);
    super('Содержимое документа некорректно', flattened);
    this.name = 'OrangeDataValidationError';
    Error.captureStackTrace(this, OrangeDataValidationError);
  }
}

class OrangeDataApiError extends OrangeDataError {
  constructor(reason) {
    super(ORANGE_API_ERRORS[reason.statusCode] || reason.message, reason.error && reason.error.errors);
    this.name = 'OrangeDataApiError';

    const { request: req, ...res } = reason.response.toJSON();
    this.sentData = reason.options.body;
    this.request = req;
    this.response = res;
    Error.captureStackTrace(this, OrangeDataApiError);
  }
}

module.exports.OrangeDataError = OrangeDataError;
module.exports.OrangeDataValidationError = OrangeDataValidationError;
module.exports.OrangeDataApiError = OrangeDataApiError;
