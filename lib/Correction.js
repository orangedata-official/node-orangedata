const { OrangeDataValidationError } = require('./errors');
const { createValidator } = require('./validation');
const schemes = require('./validation/schemes');

class Correction {
  constructor(order) {
    this.id = order.id;
    this.inn = order.inn;
    if (order.group) this.group = order.group;
    if (order.key) this.key = order.key;
    if (order.callbackUrl) this.callbackUrl = order.callbackUrl;
    if (order.ignoreItemCodeCheck) this.ignoreItemCodeCheck = order.order.ignoreItemCodeCheck;
    this.content = {
      ffdVersion: order.ffdVersion || 2,
      type: order.type,
      taxationSystem: order.taxationSystem,
      correctionType: order.correctionType,
      causeDocumentDate: order.causeDocumentDate,
      causeDocumentNumber: order.causeDocumentNumber,
      totalSum: order.totalSum,
      cashSum: order.cashSum,
      eCashSum: order.eCashSum,
      prepaymentSum: order.prepaymentSum,
      postpaymentSum: order.postpaymentSum,
      otherPaymentTypeSum: order.otherPaymentTypeSum,
      tax1Sum: order.tax1Sum,
      tax2Sum: order.tax2Sum,
      tax3Sum: order.tax3Sum,
      tax4Sum: order.tax4Sum,
      tax5Sum: order.tax5Sum,
      tax6Sum: order.tax6Sum,
      automatNumber: order.automatNumber,
      settlementAddress: order.settlementAddress,
      settlementPlace: order.settlementPlace,
    };
  }

  validate() {
    const validate = createValidator(this.content.ffdVersion === 4 ? schemes.correction12 : schemes.correction);
    const errors = validate(this);
    if (Object.keys(errors).length > 0) throw new OrangeDataValidationError(errors);
  }
}

module.exports = Correction;
