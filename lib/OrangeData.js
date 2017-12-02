const Order = require('./Order');
const HttpClient = require('./HttpClient');
const { createValidator } = require('./validation');
const { serviceOptions } = require('./validation/schemes');
const { OrangeDataError } = require('./errors');

const validate = createValidator(serviceOptions);

module.exports = class OrangeData {
  constructor(options) {
    validate(options);
    this.httpClient = new HttpClient(options);
  }

  async sendOrder(order) {
    if (order instanceof Order) order.validate();
    else throw new OrangeDataError('Объект документа не является экземпляром класса Order');
    return this.httpClient.post('/documents', order);
  }

  async getOrderStatus(inn, id) {
    if (!inn || !id) throw new OrangeDataError('Не указан ИНН или id документа');
    return this.httpClient.get(`/documents/${inn}/status/${id}`);
  }
};
