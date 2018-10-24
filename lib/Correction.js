const { OrangeDataValidationError } = require('./errors');
const { createValidator } = require('./validation');
const schemes = require('./validation/schemes');

class Correction {
  constructor(order) {
    this.id = order.id;
    this.inn = order.inn;
    if (order.group) this.group = order.group;
    if (order.key) this.key = order.key;
    this.content = {
      type: order.type,
      taxationSystem: order.taxationSystem,
      correctionType: order.correctionType,
      description: order.description,
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
    };
  }

  validate() {
    const validate = createValidator(schemes.correction);
    const errors = validate(this);
    if (Object.keys(errors).length > 0) throw new OrangeDataValidationError(errors);
  }
}

module.exports = Correction;
