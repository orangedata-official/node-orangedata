const MAX_MONEY_AMOUNT = 99999999.99;

const {
  createValidator,
  oneOf, integer, decimal, minValue, maxValue, required, minLength, maxLength, email, date, isIso8601, // general validators
  inn, phone, amounts, maxPositionsTotal, maxPaymentsTotal, validateNomenclatureCode, // specific validators
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
  paymentSubjectType: [oneOf(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
  )],
  supplierINN: [inn],
  supplierInfo: createValidator({
    phoneNumbers: [arrayOf([maxLength(19), phone])],
    name: [maxLength(239)],
  }),
  agentType: [integer, minValue(1), maxValue(127)],
  unitOfMeasurement: [maxLength(16)],
  additionalAttribute: [maxLength(64)],
  manufacturerCountryCode: [maxLength(3)],
  customsDeclarationNumber: [maxLength(32)],
  agentInfo: createValidator({
    paymentAgentOperation: [maxLength(24)],
    paymentOperatorName: [maxLength(64)],
    paymentOperatorAddress: [maxLength(243)],
    paymentOperatorINN: [maxLength(12), inn],
    paymentOperatorPhoneNumbers: [arrayOf([phone])],
    paymentAgentPhoneNumbers: [arrayOf([phone])],
    paymentTransferOperatorPhoneNumbers: [arrayOf([phone])],
  }),
  taxSum: [decimal(2)],
  nomenclatureCode: [(value) => value && validateNomenclatureCode(value)],
  excise: [decimal(2)],
  unitTaxSum: [decimal(2)],
  quantityMeasurementUnit: [minValue(0), maxValue(255)],
  itemCode: [maxLength(223)],
  fractionalQuantity: [createValidator({
    numerator: [integer],
    denominator: [integer],
  })],
  industryAttribute: [createValidator({
    foivId: [maxLength(3)],
    causeDocumentDate: [date],
    causeDocumentNumber: [maxLength(32)],
    value: [maxLength(239)],
  })],
  barcodes: [createValidator({
    ean8: [maxLength(8)],
    ean13: [maxLength(13)],
    itf14: [maxLength(14)],
    gs1: [maxLength(8)],
    mi: [maxLength(20)],
    egais20: [maxLength(23)],
    egais30: [maxLength(14)],
    f1: [maxLength(32)],
    f2: [maxLength(32)],
    f3: [maxLength(32)],
    f4: [maxLength(32)],
    f5: [maxLength(32)],
    f6: [maxLength(32)],
  })],
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
  name: [required, maxLength(64)],
  value: [required, maxLength(234)],
});

const order = {
  id: [required, maxLength(64)],
  inn: [required, inn],
  group: [maxLength(32)],
  key: [maxLength(32)],
  callbackUrl: [maxLength(1024)],
  content: createValidator({
    ffdVersion: [required, integer, oneOf([2, 4])],
    type: [required, oneOf([1, 2, 3, 4])],
    positions: [required, arrayOf(position), maxPositionsTotal(MAX_MONEY_AMOUNT)],
    checkClose: [amounts, createValidator({
      payments: [required, arrayOf(payment), maxPaymentsTotal(MAX_MONEY_AMOUNT)],
      taxationSystem: [required, integer, oneOf([0, 1, 2, 3, 4, 5])],
    })],
    customerContact: [maxLength(64), or([email, phone])],
    customer: [maxLength(243)],
    customerINN: [inn],
    ...agent,
    additionalUserAttribute: [(value) => value && isUserAttribute(value)],
    automatNumber: [maxLength(20)],
    settlementAddress: [maxLength(243)],
    settlementPlace: [maxLength(243)],
    additionalAttribute: [maxLength(16)],
    cashier: [maxLength(64)],
    cashierINN: [inn, minLength(12), maxLength(12)],
    senderEmail: [maxLength(64)],
    totalSum: [decimal(2)],
    vat1Sum: [decimal(2)],
    vat2Sum: [decimal(2)],
    vat3Sum: [decimal(2)],
    vat4Sum: [decimal(2)],
    vat5Sum: [decimal(2)],
    vat6Sum: [decimal(2)],
    customerInfo: [createValidator({
      name: [maxLength(239)],
      inn: [inn],
      birthDate: [date],
      citizenship: [integer, minValue(1), maxValue(999)],
      identityDocumentCode: [integer, minValue(1), maxValue(99)],
      identityDocumentData: [maxLength(64)],
      address: [maxLength(239)],
    })],
    operationalAttribute: [createValidator({
      date: [isIso8601],
      id: [integer, minValue(0), maxValue(255)],
      value: [maxLength(64)],
    })],
    industryAttribute: [createValidator({
      foivId: [maxLength(3)],
      causeDocumentDate: [date],
      causeDocumentNumber: [maxLength(32)],
      value: [maxLength(239)],
    })],
  }),
};
const correction = {
  id: [required, maxLength(64)],
  inn: [required, inn],
  group: [maxLength(32)],
  key: [maxLength(32)],
  callbackUrl: [maxLength(1024)],
  content: createValidator({
    ffdVersion: [required, integer, oneOf([2])],
    type: [required, oneOf([1, 3])],
    taxationSystem: [required, integer, oneOf([0, 1, 2, 3, 4, 5])],
    correctionType: [required, oneOf([0, 1])],
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

const correction12 = {
  ffdVersion: [required, integer, oneOf([4])],
  type: [required, integer, oneOf([1, 2, 3, 4])],
  positions: [required, arrayOf(position), maxPositionsTotal(MAX_MONEY_AMOUNT)],
  checkClose: [amounts, createValidator({
    payments: [required, arrayOf(payment), maxPaymentsTotal(MAX_MONEY_AMOUNT)],
    taxationSystem: [required, integer, oneOf([0, 1, 2, 3, 4, 5])],
  })],
  customerContact: [maxLength(64), or([email, phone]), required],
  correctionType: [required, oneOf([0, 1])],
  causeDocumentDate: [required, isIso8601],
  causeDocumentNumber: [required, maxLength(32)],
  additionalUserAttribute: [(value) => value && isUserAttribute(value)],
  additionalAttribute: [maxLength(64)],
  automatNumber: [maxLength(20)],
  settlementAddress: [maxLength(243)],
  settlementPlace: [maxLength(243)],
  cashier: [maxLength(64)],
  cashierINN: [inn, minLength(12), maxLength(12)],
  senderEmail: [maxLength(64)],
  totalSum: [decimal(2)],
  vat1Sum: [decimal(2)],
  vat2Sum: [decimal(2)],
  vat3Sum: [decimal(2)],
  vat4Sum: [decimal(2)],
  vat5Sum: [decimal(2)],
  vat6Sum: [decimal(2)],
  customerInfo: [createValidator({
    name: [maxLength(239)],
    inn: [inn],
    birthDate: [date],
    citizenship: [integer, minValue(1), maxValue(999)],
    identityDocumentCode: [integer, minValue(1), maxValue(99)],
    identityDocumentData: [maxLength(64)],
    address: [maxLength(239)],
  })],
  operationalAttribute: [createValidator({
    date: [isIso8601],
    id: [integer, minValue(0), maxValue(255)],
    value: [maxLength(64)],
  })],
  industryAttribute: [createValidator({
    foivId: [maxLength(3)],
    causeDocumentDate: [date],
    causeDocumentNumber: [maxLength(32)],
    value: [maxLength(239)],
  })],
};

module.exports.serviceOptions = serviceOptions;
module.exports.order = order;
module.exports.correction = correction;
module.exports.correction12 = correction12;
