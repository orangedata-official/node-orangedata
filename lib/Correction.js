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
    if (order.ignoreItemCodeCheck) this.ignoreItemCodeCheck = order.ignoreItemCodeCheck;
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
      tax7Sum: order.tax7Sum,
      tax8Sum: order.tax8Sum,
      tax9Sum: order.tax9Sum,
      tax10Sum: order.tax10Sum,
      useTax20: order.useTax20,
      automatNumber: order.automatNumber,
      settlementAddress: order.settlementAddress,
      settlementPlace: order.settlementPlace,
      positions: order.positions,
      checkClose: order.checkClose,
      customerContact: order.customerContact,
      additionalUserAttribute: order.additionalUserAttribute,
      additionalAttribute: order.additionalAttribute,
      cashier: order.cashier,
      cashierINN: order.cashierINN,
      senderEmail: order.senderEmail,
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

  validate() {
    const validate = createValidator(this.content.ffdVersion === 4 ? schemes.correction12 : schemes.correction);
    const errors = validate(this);
    if (Object.keys(errors).length > 0) throw new OrangeDataValidationError(errors);
  }
}

module.exports = Correction;
