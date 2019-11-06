const { isInt, isEmail, isDecimal } = require('validator');

const isEmptyString = (value) => (typeof value === 'string' && !/\S/.test(value));
const isEmpty = (value) => value === undefined || value === null || value === '' || isEmptyString(value);
const isEmptyArray = (value) => !value || value.length === 0;
const join = (rules) => (value, data) => rules.map((rule) => rule(value, data)).filter((error) => !!error)[0];


const totalPositions = (positions = []) => Number(positions.reduce(
  (sum, position) => sum + (position.price * position.quantity), 0,
).toFixed(2));

const totalPayments = (payments = []) => Number(payments.reduce(
  (sum, payment) => sum + payment.amount, 0,
).toFixed(2));

// Genareal validators:

module.exports.required = function required(value) {
  if (isEmpty(value)) return 'Требует заполнения';
  return false;
};

module.exports.minLength = function minLength(min) {
  return (value) => {
    if (!isEmpty(value) && value.length < min) {
      return `Должно быть не короче ${min} символов`;
    }
    return false;
  };
};

module.exports.maxLength = function maxLength(max) {
  return (value) => {
    if (!isEmpty(value) && value.length > max) {
      return `Должно быть не длиннее ${max} символов`;
    }
    return false;
  };
};

module.exports.minValue = function minValue(min) {
  return (value) => {
    if (!isEmpty(value) && (value < min)) {
      return `Должно быть больше или равно ${min}`;
    }
    return false;
  };
};

module.exports.maxValue = function maxValue(max) {
  return (value) => {
    if (!isEmpty(value) && (value > max)) {
      return `Должно быть меньше или равно ${max}`;
    }
    return false;
  };
};

module.exports.integer = function integer(value) {
  if (!isEmpty(value) && !isInt(`${value}`)) {
    return 'Должно быть целым числом';
  }
  return false;
};

module.exports.decimal = function decimal(decimalDigits = '2') {
  return (value) => {
    if (!isEmpty(value) && !isDecimal(`${value}`, { decimal_digits: `1,${decimalDigits}` })) {
      return `Должно быть числом с точностью до ${decimalDigits} символов после точки`;
    }
    return false;
  };
};


module.exports.oneOf = function oneOf(enumeration) {
  return (value) => {
    if (!isEmpty(value) && !enumeration.includes(value)) {
      return `Должно быть одним из: ${enumeration.join(', ')}`;
    }
    return false;
  };
};

module.exports.email = function email(value) {
  if (!isEmpty(value) && !isEmail(value)) {
    return 'Должно быть корректным адресом эл. почты';
  }
  return false;
};

// Specific validators:

module.exports.phone = function phone(value) {
  if (!isEmpty(value) && !/^\+\d+$/i.test(value)) {
    return 'Должно быть телефоном в формате +{Ц}';
  }
  return false;
};

// Идентификационный номер налогоплательщика (ИНН)
module.exports.inn = function inn(value) {
  if (isEmpty(value)) return false;

  const ratios = [2, 4, 10, 3, 5, 9, 4, 6, 8];
  if (value.length === 10) {
    const n10 = ratios.reduce((sum, ratio, index) => sum + (Number(value.charAt(index)) * ratio), 0);
    if (n10 % 11 % 10 !== Number(value[9])) {
      return 'Неверное значение ИНН.';
    }
  } else if (value.length === 12) {
    const ratios11 = [7].concat(ratios);
    const ratios12 = [3].concat(ratios11);
    const n11 = ratios11.reduce((sum, ratio, index) => sum + (Number(value.charAt(index)) * ratio), 0);
    const n12 = ratios12.reduce((sum, ratio, index) => sum + (Number(value.charAt(index)) * ratio), 0);
    if (n11 % 11 % 10 !== Number(value[10])) {
      return 'Неверное значение ИНН';
    }
    if (n12 % 11 % 10 !== Number(value[11])) {
      return 'Неверное значение ИНН.';
    }
  } else {
    return 'ИНН должен содержать 10 или 12 цифр';
  }

  return false;
};


// Максимальная сумма чека по позициям
module.exports.maxPositionsTotal = function maxPositionsTotal(max) {
  return (positions) => {
    if (totalPositions(positions) > max) {
      return `Итоговая сумма чека превышает максимально допустимую ${max} рублей.`;
    }
    return false;
  };
};

// Максимальная сумма оплаты
module.exports.maxPaymentsTotal = function maxPaymentsTotal(max) {
  return (payments) => {
    if (totalPayments(payments) > max) {
      return `Сумма оплаты превышает максимальную ${max} рублей.`;
    }
    return false;
  };
};

// Проверки сумм
module.exports.amounts = function amounts({ payments = [] } = {}, { positions = [] } = {}) {
  const totalPaymentsWithoutCash = totalPayments(payments.filter((payment) => payment.type !== 1));
  if (totalPayments(payments) < totalPositions(positions)) {
    return 'Сумма всех типов оплаты меньше итога чека.';
  }
  if (totalPaymentsWithoutCash > totalPositions(positions)) {
    return 'Вносимая безналичной оплатой сумма больше итога чека.';
  }
  return false;
};

// Creates validate function
function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const error = typeof rules[key] === 'function'
        ? rules[key](data[key]) // nested validator
        : join(rules[key])(data[key], data);
      if (!error || (typeof error === 'object' && Object.keys(error).length === 0)) return;

      if (typeof error === 'object') {
        Object.entries(error).forEach(([subKey, value]) => { errors[`${key}.${subKey}`] = value; });
      } else {
        errors[key] = error;
      }
    });
    return errors;
  };
}

module.exports.createValidator = createValidator;

// Validator wrappers

module.exports.customMessage = function customMessage(validate, message) {
  return (value) => (validate(value) ? message : false);
};

module.exports.or = function or(rules) {
  return (value, data) => {
    const errors = rules.map((rule) => rule(value, data)); // .filter(error => !!error)
    if (errors.every((error) => !!error)) return errors.join(' или ');
    return false;
  };
};

module.exports.arrayOf = function arrayOf(rules) {
  return (values) => {
    if (isEmptyArray(values)) return false;
    if (!Array.isArray(values)) return 'Должно быть массивом значений';
    const rule = createValidator(Array(values.length).fill(rules));
    const result = rule(values);
    return Object.keys(result).length > 0 ? result : false;
  };
};
