const {
  createValidator,
  oneOf, integer, decimal, minValue, maxValue, required, maxLength, email, // general validators
  inn, phone, // specific validators
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
    positions: [required, arrayOf(position)],
    checkClose: createValidator({
      payments: [required, arrayOf(payment)],
      taxationSystem: [required, integer, oneOf([0, 1, 2, 3, 4, 5])],
    }),
    customerContact: [required, maxLength(64), or([email, phone])],
    ...agent,
    additionalUserAttribute: [value => value && isUserAttribute(value)],
  }),
};

module.exports.serviceOptions = serviceOptions;
module.exports.order = order;
