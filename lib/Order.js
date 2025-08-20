const { OrangeDataValidationError } = require('./errors');
const { createValidator } = require('./validation');
const schemes = require('./validation/schemes');

class Order {
  constructor(order) {
    const {
      electronicPaymentsInfo,
    } = order;
    this.id = order.id;
    this.inn = order.inn;
    if (order.group) this.group = order.group;
    if (order.key) this.key = order.key;
    if (order.callbackUrl) this.callbackUrl = order.callbackUrl;
    if (order.ignoreItemCodeCheck) this.ignoreItemCodeCheck = order.ignoreItemCodeCheck;
    this.content = {
      ffdVersion: order.ffdVersion || 2,
      type: order.type,
      positions: [],
      checkClose: {
        taxationSystem: order.taxationSystem,
        payments: [],
        ...(electronicPaymentsInfo && { electronicPaymentsInfo }),
      },
      customerContact: order.customerContact,
      customer: order.customer,
      customerINN: order.customerINN,
      automatNumber: order.automatNumber,
      settlementAddress: order.settlementAddress,
      settlementPlace: order.settlementPlace,
      additionalAttribute: order.additionalAttribute,
      cashier: order.cashier,
      cashierINN: order.cashierINN,
      senderEmail: order.senderEmail,
      totalSum: order.totalSum,
      vat1Sum: order.vat1Sum,
      vat2Sum: order.vat2Sum,
      vat3Sum: order.vat3Sum,
      vat4Sum: order.vat4Sum,
      vat5Sum: order.vat5Sum,
      vat6Sum: order.vat6Sum,
      vat7Sum: order.vat7Sum,
      vat8Sum: order.vat8Sum,
      vat9Sum: order.vat9Sum,
      vat10Sum: order.vat10Sum,
      customerInfo: order.customerInfo,
      operationalAttribute: order.operationalAttribute,
      industryAttribute: order.industryAttribute,
    };
  }

  addPosition({
    quantity, price, tax, taxSum, text, paymentMethodType, excise, agentType, agentInfo,
    paymentSubjectType, nomenclatureCode, supplierINN, supplierInfo, unitOfMeasurement,
    additionalAttribute, manufacturerCountryCode, customsDeclarationNumber, unitTaxSum,
    quantityMeasurementUnit, itemCode, fractionalQuantity, industryAttribute, barcodes,
    plannedStatus,
  }) {
    const { ffdVersion } = this.content;
    this.content.positions.push({
      quantity,
      price,
      tax,
      taxSum,
      text,
      paymentMethodType,
      paymentSubjectType,
      nomenclatureCode,
      supplierINN,
      supplierInfo,
      agentType,
      agentInfo,
      unitOfMeasurement,
      additionalAttribute,
      manufacturerCountryCode,
      customsDeclarationNumber,
      excise,
      unitTaxSum,
      quantityMeasurementUnit: ffdVersion === 4 ? quantityMeasurementUnit : undefined,
      itemCode,
      fractionalQuantity,
      industryAttribute,
      barcodes,
      plannedStatus,
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
