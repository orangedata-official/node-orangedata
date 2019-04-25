const MAX_MONEY_AMOUNT = 99999999.99;

const {
  createValidator,
  oneOf, integer, decimal, minValue, maxValue, required, maxLength, email, // general validators
  inn, phone, amounts, maxPositionsTotal, maxPaymentsTotal, // specific validators
  or, arrayOf, // wrappers
} = require('./index');

const serviceOptions = {
  ca: [required],
  passphrase: [required],
  key: [required],
  cert: [required],
  privateKey: [required],
};

const position = createValidator({
  quantity: [required, decimal(6)],
  price: [required, decimal(2)],
  tax: [required, integer, oneOf([1, 2, 3, 4, 5, 6])],
  text: [required, maxLength(128)],
  paymentMethodType: [oneOf([1, 2, 3, 4, 5, 6, 7])],
  paymentSubjectType: [oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])],
  nomenclatureCode: [maxLength(32)],
  supplierINN: [inn],
  supplierInfo: createValidator({
    phoneNumbers: [arrayOf([maxLength(19), phone])],
    name: [maxLength(239)],
  }),
});

const payment = createValidator({
  type: [required, oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])],
  amount: [required, decimal(2)],
});

const agent = {
  agentType: [integer, minValue(1), maxValue(127)],
  paymentTransferOperatorPhoneNumbers: [arrayOf([maxLength(19), phone])],
  paymentAgentOperation: [maxLength(24)],
  paymentAgentPhoneNumbers: [arrayOf([maxLength(19), phone])],
  paymentOperatorPhoneNumbers: [arrayOf([maxLength(19), phone])],
  paymentOperatorName: [maxLength(64)],
  paymentOperatorAddress: [maxLength(244)],
  paymentOperatorINN: [inn],
  supplierPhoneNumbers: [arrayOf([maxLength(19), phone])],
};

const isUserAttribute = createValidator({
  name: [required, maxLength(24)],
  value: [required, maxLength(175)],
});

const order = {
  id: [required, maxLength(64)],
  inn: [required, inn],
  group: [maxLength(32)],
  key: [maxLength(32)],
  content: createValidator({
    type: [required, oneOf([1, 2, 3, 4])],
    positions: [required, arrayOf(position), maxPositionsTotal(MAX_MONEY_AMOUNT)],
    checkClose: [amounts, createValidator({
      payments: [required, arrayOf(payment), maxPaymentsTotal(MAX_MONEY_AMOUNT)],
      taxationSystem: [required, integer, oneOf([0, 1, 2, 3, 4, 5])],
    })],
    customerContact: [maxLength(64), or([email, phone])],
    ...agent,
    additionalUserAttribute: [value => value && isUserAttribute(value)],
    automatNumber: [maxLength(20)],
    settlementAddress: [maxLength(243)],
    settlementPlace: [maxLength(243)],
    additionalAttribute: [maxLength(16)],
  }),
};
const correction = {
  id: [required, maxLength(64)],
  inn: [required, inn],
  group: [maxLength(32)],
  key: [maxLength(32)],
  content: createValidator({
    type: [required, oneOf([1, 3])],
    taxationSystem: [required, integer, oneOf([0, 1, 2, 3, 4, 5])],
    correctionType: [required, oneOf([0, 1])],
    description: [required, maxLength(243)],
    causeDocumentDate: [required],
    causeDocumentNumber: [required, maxLength(32)],
    totalSum: [required, decimal(2)],
    cashSum: [decimal(2)],
    eCashSum: [decimal(2)],
    prepaymentSum: [decimal(2)],
    postpaymentSum: [decimal(2)],
    otherPaymentTypeSum: [decimal(2)],
    tax1Sum: [decimal(2)],
    tax2Sum: [decimal(2)],
    tax3Sum: [decimal(2)],
    tax4Sum: [decimal(2)],
    tax5Sum: [decimal(2)],
    tax6Sum: [decimal(2)],
    automatNumber: [maxLength(20)],
    settlementAddress: [maxLength(243)],
    settlementPlace: [maxLength(243)],
  }),
};

module.exports.serviceOptions = serviceOptions;
module.exports.order = order;
module.exports.correction = correction;
