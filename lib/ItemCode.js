const { OrangeDataValidationError } = require('./errors');
const { createValidator } = require('./validation');
const schemes = require('./validation/schemes');

class ItemCode {
  constructor(order) {
    this.id = order.id;
    this.inn = order.inn;

    if (order.group) this.group = order.group;
    if (order.key) this.key = order.key;
    if (order.callbackUrl) this.callbackUrl = order.callbackUrl;
    if (order.meta) this.meta = order.meta;
    if (order.ignoreItemCodeCheck) this.ignoreItemCodeCheck = order.ignoreItemCodeCheck;

    this.content = {
      plannedStatus: order.plannedStatus,
      itemCode: order.itemCode,
      quantityMeasurementUnit: order.quantityMeasurementUnit,
      quantity: order.quantity,
      fractionalQuantity: order.fractionalQuantity,
    };
  }

  validate() {
    const validate = createValidator(schemes.itemCode);
    const errors = validate(this);
    if (Object.keys(errors).length > 0) throw new OrangeDataValidationError(errors);
  }
}

module.exports = ItemCode;
