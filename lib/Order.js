const { OrangeDataValidationError } = require('./errors');
const { createValidator } = require('./validation');
const schemes = require('./validation/schemes');

class Order {
  constructor(order) {
    this.id = order.id;
    this.inn = order.inn;
    if (order.group) this.group = order.group;
    if (order.key) this.key = order.key;
    this.content = {
      type: order.type,
      positions: [],
      checkClose: { taxationSystem: order.taxationSystem, payments: [] },
      customerContact: order.customerContact,
      automatNumber: order.automatNumber,
      settlementAddress: order.settlementAddress,
      settlementPlace: order.settlementPlace,
    };
  }

  addPosition({
    quantity, price, tax, text, paymentMethodType,
    paymentSubjectType, nomenclatureCode, supplierINN, supplierInfo,
  }) {
    this.content.positions.push({
      quantity,
      price,
      tax,
      text,
      paymentMethodType,
      paymentSubjectType,
      nomenclatureCode,
      supplierINN,
      supplierInfo,
    });
    return this;
  }

  addPayment({ type, amount }) {
    this.content.checkClose.payments.push({ type, amount });
    return this;
  }

  addAgent(agent) {
    this.content.agentType = agent.agentType;
    this.content.paymentTransferOperatorPhoneNumbers = agent.paymentTransferOperatorPhoneNumbers;
    this.content.paymentAgentOperation = agent.paymentAgentOperation;
    this.content.paymentAgentPhoneNumbers = agent.paymentAgentPhoneNumbers;
    this.content.paymentOperatorPhoneNumbers = agent.paymentOperatorPhoneNumbers;
    this.content.paymentOperatorName = agent.paymentOperatorName;
    this.content.paymentOperatorAddress = agent.paymentOperatorAddress;
    this.content.paymentOperatorINN = agent.paymentOperatorINN;
    this.content.supplierPhoneNumbers = agent.supplierPhoneNumbers;
    return this;
  }

  addUserAttribute(options) {
    this.content.additionalUserAttribute = { name: options.name, value: options.value };
    return this;
  }

  validate() {
    const validate = createValidator(schemes.order);
    const errors = validate(this);
    if (Object.keys(errors).length > 0) throw new OrangeDataValidationError(errors);
  }
}

module.exports = Order;
