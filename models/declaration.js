const moment = require('moment');
// const {DateTime} = require('luxon');
moment.locale('ru');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeSchema = new Schema({
  month: String,
  code: String,
  amount: Number
});
const employersSchema = new Schema({
  name: String,
  phone: {
    type: String,
    match: [/^[0-9()+\- ]*$/, "Неверный номер"]
  },
  inn: {
    type: String,
    match: [/^\d{10}$|^\d{12}$/, "ИНН состоит из 10 или 12 цифр"],
    maxlength: [12, "ИНН состоит из 10 или 12 цифр"]
  },
  kpp: {
    type: String,
    match: [/\d{9}/, "КПП состоит из 9 цифр"],
    maxlength: [9, "КПП состоит из 9 цифр"]
  },
  oktmo: {
    type: String,
    match: [/^\d{8}$|^\d{11}$/, "ОКТМО состоит из 8 или 11 цифр"],
    maxlength: [11, "ОКТМО состоит из 8 или 11 цифр"]
  },
  income: [incomeSchema],
  month_income: [Number],
  tax: Number
});
const childSchema = new Schema({
  child_count: String,
  invalid: Boolean
});
const teachSchema = new Schema({
  amount: Number
});
const healSchema = new Schema({
  amount: Number,
  expensive: Number,
  medications: Number
});
const sellEstateSchema = new Schema({
  type: {
    type: String,
    enum: ['house', 'fraction', 'garage']
  },
  buy_price: Number,
  sell_price: Number,
  fraction_size: {
    type: Number,
    min: [0, 'Доля указывается про процентах от 0 до 100'],
    max: [100, 'Доля указывается про процентах от 0 до 100']
  },
  mortgage: {
    type: Number,
    default: 0
  },
  contract: {
    type: String,
    enum: ['single', 'multi']
  },
  kadastr_number: String,
  kadastr_price: Number,
  face: {
    type: String,
    enum: ['individual', 'entity']
  },
  individual_name: String,
  entity_name: String,
  entity_oktmo: {
    type: String,
    match: [/^\d{8}$|^\d{11}$/, "ОКТМО состоит из 8 или 11 цифр"],
    maxlength: [11, "ОКТМО состоит из 8 или 11 цифр"]
  },
  entity_inn: {
    type: String,
    match: [/^\d{10}$|^\d{12}$/, "ИНН состоит из 10 или 12 цифр"],
    maxlength: [12, "ИНН состоит из 10 или 12 цифр"]
  },
  entity_kpp: {
    type: String,
    match: [/\d{9}/, "КПП состоит из 9 цифр"],
    maxlength: [9, "КПП состоит из 9 цифр"]
  }
});
const sellTransportSchema = new Schema({
  sell_price: Number,
  buy_price: Number,
  face: {
    type: String,
    enum: ['individual', 'entity']
  },
  individual_name: String,
  entity_name: String,
  entity_oktmo: {
    type: String,
    match: [/^\d{8}$|^\d{11}$/, "ОКТМО состоит из 8 или 11 цифр"],
    maxlength: [11, "ОКТМО состоит из 8 или 11 цифр"]
  },
  entity_inn: {
    type: String,
    match: [/^\d{10}$|^\d{12}$/, "ИНН состоит из 10 или 12 цифр"],
    maxlength: [12, "ИНН состоит из 10 или 12 цифр"]
  },
  entity_kpp: {
    type: String,
    match: [/\d{9}/, "КПП состоит из 9 цифр"],
    maxlength: [9, "КПП состоит из 9 цифр"]
  }
});
const declarationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  last_edit: {
    type: Date,
    default: new Date()
  },
  payment: Object,
  payment_status: String,
  idempotence_key: String,
  year: {
    type: Number,
    min: 2017,
    max: 2019
  },
  ifns: {
    type: String,
    match: [/\d{4}/, "Код ИФНС состоит из 4 цифр"],
    maxlength: [4, "Код ИФНС состоит из 4 цифр"]
  },
  ifns_name: String,
  name: {
    type: String
  },
  dadata: {
    name: {
      result: String,
      result_genitive: String,
      result_dative: String,
      result_ablative: String,
      surname: String,
      name: String,
      patronymic: String,
      gender: String
    }
  },
  phone: {
    type: String,
    match: [/^[0-9()+\- ]*$/, "Неверный номер"]
  },
  birthdate: {
    type: String,
    match: [/\d{2}.\d{2}.\d{4}/, "Неверная дата"]
  },
  birthplace: String,
  inn: {
    type: String,
    match: [/\d{12}/, "ИНН состоит из 12 цифр"],
    maxlength: [12, "ИНН состоит из 12 цифр"]
  },
  passport_seria: {
    type: String,
    match: [/\d{4}/, "Серия паспорта состоит из 4 цифр"],
    maxlength: [4, "Серия паспорта состоит из 4 цифр"]
  },
  passport_number: {
    type: String,
    match: [/\d{6}/, "Номер паспорта состоит из 6 цифр"],
    maxlength: [6, "Номер паспорта состоит из 6 цифр"]
  },
  passport_issue_date: {
    type: String,
    match: [/\d{2}.\d{2}.\d{4}/, "Неверная дата"]
  },
  passport_issue_place: String,
  address: String,
  category: String,
  bank_name: String,
  bank_inn: {
    type: String,
    match: [/\d{10}/, "ИНН состоит из 10 цифр"],
    maxlength: [10, "ИНН состоит из 10 цифр"]
  },
  bank_bik: {
    type: String,
    match: [/\d{9}/, "БИК состоит из 9 цифр"],
    maxlength: [9, "БИК состоит из 9 цифр"]
  },
  bank_kpp: {
    type: String,
    match: [/\d{9}/, "КПП состоит из 9 цифр"],
    maxlength: [9, "КПП состоит из 9 цифр"]
  },
  bank_correspondent_account: {
    type: String,
    match: [/\d{20}/, "Корр. счет состоит из 20 цифр"],
    maxlength: [20, "Корр. счет состоит из 20 цифр"]
  },
  bank_personal_account: {
    type: String,
    match: [/\d{20}/, "Лицевой счет состоит из 20 цифр"],
    maxlength: [20, "Лицевой счет состоит из 20 цифр"]
  },
  standart_category: Number,
  employers: [employersSchema],
  child_18: [childSchema],
  child_24: [childSchema],

  teach_me: [{
    type: teachSchema
  }],
  teach_child: [{
    type: teachSchema
  }],
  teach_brother: [{
    type: teachSchema
  }],
  heal_me: [{
    type: healSchema
  }],
  heal_child: [{
    type: healSchema
  }],
  heal_parent: [{
    type: healSchema
  }],
  sell_estate: [{
    type: sellEstateSchema
  }],
  sell_transport: [{
    type: sellTransportSchema
  }]
}, {minimize: false});

declarationSchema.virtual('STEP_1_FULLNESS').get(function () {
  let errors = [];
  let fields = [
    this.name,
    this.phone,
    this.birthdate,
    this.birthplace,
    this.inn,
    this.passport_seria,
    this.passport_number,
    this.passport_issue_place,
    this.passport_issue_date,
    this.address,
    this.ifns,
    this.bank_name,
    this.bank_inn,
    this.bank_bik,
    this.bank_kpp,
    this.bank_correspondent_account,
    this.bank_personal_account,
    this.category
  ].every(field => !!field);
  if (!fields) {
    errors.push('Заполнены не все поля');
  }
  return errors;
});

declarationSchema.virtual('STEP_2_FULLNESS').get(function () {
  let errors = [];
  if (!this.employers.length) {
    errors.push('не добавлено ни одного работодателя');
  } else {
    this.employers.forEach((employer, index) => {
      let fields = [employer.name, employer.phone, employer.inn, employer.kpp, employer.oktmo, employer.tax].every(field => !!field);
      let incomes = employer.income.every((income) => {
        return !!income.month && !!income.code && !!income.amount;
      });
      if (!fields || !incomes) {
        errors.push(`В анкете работодателя №${index + 1} заполнены не все поля`);
      }
    });
  }
  return errors;
});

declarationSchema.virtual('STEP_3_FULLNESS').get(function () {
  let errors = {
    empty: false,
    errors: []
  };
  let childs = this.child_18.concat(this.child_24);
  if (!childs.length) {
    errors.empty = true;
    errors.errors.push('дети отсутствуют');
  }
  return errors;
});

declarationSchema.virtual('STEP_4_FULLNESS').get(function () {
  let errors = {
    empty: false,
    errors: []
  };
  let expenses = this.teach_me.concat(this.teach_child, this.teach_brother, this.heal_me, this.heal_child, this.heal_parent);
  if (!expenses.length) {
    errors.empty = true;
    errors.errors.push('расходы отсутствуют');
  } else {
    if (!expenses.every(expense => !!expense.amount)) {
      errors.errors.push(`Заполнены не все поля "сумма"`);
    }
  }
  return errors;
});

declarationSchema.virtual('STEP_5_FULLNESS').get(function () {
  let errors = {empty: false, errors: []};
  let fields = [];
  this.sell_estate.forEach(estate => {
    fields.push(estate.buy_price);
    fields.push(estate.sell_price);
    if (estate.type === "fraction") fields.push(estate.fraction_size);
    if (estate.type !== "garage") fields.push(estate.mortgage);
    fields.push(estate.kadastr_number);
    fields.push(estate.kadastr_price);
    if (estate.face === "individual") fields.push(estate.individual_name);
    if (estate.face === "entity") {
      fields.push(estate.entity_name);
      fields.push(estate.entity_oktmo);
      fields.push(estate.entity_inn);
      fields.push(estate.entity_kpp);
    }
  });
  this.sell_transport.forEach(transport => {
    fields.push(transport.buy_price);
    fields.push(transport.sell_price);
    if (transport.face === "individual") fields.push(transport.individual_name);
    if (transport.face === "entity") {
      fields.push(transport.entity_name);
      fields.push(transport.entity_oktmo);
      fields.push(transport.entity_inn);
      fields.push(transport.entity_kpp);
    }
  });
  let full = fields.every(field => {
    return String(field) !== "";
  });
  if (!fields.length) {
    errors.empty = true;
    errors.errors.push('отсутствуют операции с недвижимостью и транспортом');
  } else {
    if (!full) errors.errors.push('Заполнены не все поля');
  }
  return errors;
});

declarationSchema.virtual('FULLNESS').get(function () {
  let result = [];
  if (this.STEP_1_FULLNESS.length && this.STEP_2_FULLNESS.length) {
    result.push("Необходимо полностью заполнить данные о физ. лице и данные о работодателе");
  } else if (this.STEP_1_FULLNESS.length) {
    result.push("Необходимо полностью заполнить данные о физ. лице");
  } else if (this.STEP_2_FULLNESS.length) {
    result.push("Необходимо заполнить данные о работодателе и доходах");
  }
  if (this.STEP_3_FULLNESS.empty && this.STEP_4_FULLNESS.empty && this.STEP_5_FULLNESS.empty) {
    result.push("Необходимо заполнить один из вычетов");
  }
  if (this.STEP_4_FULLNESS.errors.length && !this.STEP_4_FULLNESS.empty) {
    result.push(`Необходимо заполнить поля "сумма" в социальном вычете`);
  }
  if (this.STEP_5_FULLNESS.errors.length && !this.STEP_5_FULLNESS.empty) {
    result.push(`Необходимо заполнить все поля в вычете на продажу имущества`);
  }
  return result;
});

declarationSchema.virtual('NOT_FILLED_STEPS').get(function () {
  let result = [];
  if (this.STEP_1_FULLNESS.length) {
    result.push(1);
  }
  if (this.STEP_2_FULLNESS.length) {
    result.push(2);
  }
  if (this.STEP_3_FULLNESS.errors.length && !this.STEP_3_FULLNESS.empty) {
    result.push(3);
  }
  if (this.STEP_4_FULLNESS.errors.length && !this.STEP_4_FULLNESS.empty) {
    result.push(4);
  }
  if (this.STEP_5_FULLNESS.errors.length && !this.STEP_5_FULLNESS.empty) {
    result.push(5);
  }
  if (this.STEP_3_FULLNESS.empty && this.STEP_4_FULLNESS.empty && this.STEP_5_FULLNESS.empty) {
    result.push(3);
  }
  return result;
});

/*
ДАТА РЕДАКТИРОВАНИЯ ДЕКЛАРАЦИИ В УДОБОЧИТАЕМОМ ВИДЕ
*/
declarationSchema.virtual('EDITED').get(function () {
  return moment(this.last_edit).format("LL, HH:mm");
});

/*
ДАТА ОПЛАТЫ ДЕКЛАРАЦИИ В УДОБОЧИТАЕМОМ ВИДЕ
*/
declarationSchema.virtual('BUYED').get(function () {
  return moment(this.payment.captured_at).format("LL, HH:mm");
});

/*
ОБЩИЙ ДОХОД ЗА ГОД
10-140 Размер налоговой базы в отношении доходов, облагаемых по ставке, установленной пунктом 1 статьи 224 Налогового кодекса Российской Федерации, за минусом налоговых вычетов

!!! Это поле дублирует ESTATE_140

*/
declarationSchema.virtual('EMPLOYERS_INCOME').get(function () {
  let result = 0;
  this.employers.forEach((employer) => {
    result += employer.month_income.reduce((a, b) => a + b, 0);
  });
  return String(result);
});

/*
РАСЧЕТ УПЛАЧЕННОГО НАЛОГА С ОБЩЕГО ДОХОДА
*/
declarationSchema.virtual('EMPLOYERS_TAX').get(function () {
  let result = 0;
  this.employers.forEach((employer, index) => {
    result += employer.tax;
  });
  return String(result);
});

/*
ОТДАЕТ МАССИВ ЗАПИСЕЙ ДЛЯ ПРИЛОЖЕНИЯ 1
*/
declarationSchema.virtual('APPENDIX_1').get(function () {
  let result = [];
  this.employers.forEach((employer, index) => {
    let item = {};
    item.s010 = "13";
    item.s020 = "07";
    item.s030 = employer.inn;
    item.s040 = employer.kpp;
    item.s050 = employer.oktmo;
    item.s060 = employer.name;
    item.s070 = String(employer.income.reduce((a, b) => a + b.amount, 0));
    item.s080 = String(employer.tax);
    result.push(item);
  });
  this.sell_estate.forEach((estate, index) => {
    let item = {};
    let sell_type = estate.type === "fraction" ? " (продажа доли в недвижимом имуществе)" : " (продажа недвижимого имущества)";
    item.s010 = "13";
    item.s020 = estate.type === "garage" ? "12" : "02";
    item.s070 = estate.sell_price < (estate.kadastr_price / 100) * 70 ? (estate.kadastr_price / 100) * 70 : estate.sell_price;
    if (estate.face === "entity") {
      item.s030 = estate.entity_inn;
      item.s040 = estate.entity_kpp;
      item.s050 = estate.entity_oktmo;
      item.s060 = estate.entity_name + sell_type;
    } else {
      item.s060 = estate.individual_name + sell_type;
    }
    item.s080 = "0";
    result.push(item);
  });
  this.sell_transport.forEach((transport, index) => {
    let item = {};
    item.s010 = "13";
    item.s020 = "13";
    if (transport.face === "entity") {
      item.s030 = transport.entity_inn;
      item.s040 = transport.entity_kpp;
      item.s050 = transport.entity_oktmo;
      item.s060 = transport.entity_name + " (продажа транспортного средства)"
    } else {
      item.s060 = transport.individual_name + " (продажа транспортного средства)"
    }
    item.s070 = transport.sell_price;
    item.s080 = "0";
    result.push(item);
  });
  return result;
});


/*
ОТДАЕТ МАССИВ ЗАПИСЕЙ ДЛЯ РАСЧЕТА К ПРИЛОЖЕНИЮ 1
*/
declarationSchema.virtual('APPENDIX_1_CALCULATION').get(function () {
  let result = [];
  this.sell_estate.forEach((estate, index) => {
    let item = {};
    item.s010 = estate.kadastr_number;
    item.s020 = estate.kadastr_price;
    item.s030 = estate.sell_price;
    item.s040 = estate.kadastr_price ? (estate.kadastr_price / 100) * 70 : null;
    item.s050 = item.s030 > item.s040 ? item.s030 : item.s040;
    result.push(item);
  });
  return result;
});

/*
ОБЩАЯ СУММА ДОХОДА С КОДОМ 2762
*/
declarationSchema.virtual('APPENDIX_4_010').get(function () {
  let result = 0;
  this.employers.forEach((employer, index) => {
    result += employer.income.reduce((a, b) => {
      if (b.code === "2762") {
        return a + b.amount;
      } else {
        return a;
      }
    }, 0);
  });
  if (result > 50000) result = 50000;
  return String(result);
});

/*
ОБЩАЯ СУММА ДОХОДА С КОДОМ 2720
*/
declarationSchema.virtual('APPENDIX_4_020').get(function () {
  let result = 0;
  this.employers.forEach((employer, index) => {
    result += employer.income.reduce((a, b) => {
      if (b.code === "2720") {
        return a + b.amount;
      } else {
        return a;
      }
    }, 0);
  });
  if (result > 4000) result = 4000;
  return String(result);
});

/*
ОБЩАЯ СУММА ДОХОДА С КОДОМ 2760
*/
declarationSchema.virtual('APPENDIX_4_040').get(function () {
  let result = 0;
  this.employers.forEach((employer, index) => {
    result += employer.income.reduce((a, b) => {
      if (b.code === "2760") {
        return a + b.amount;
      } else {
        return a;
      }
    }, 0);
  });
  if (result > 4000) result = 4000;
  return String(result);
});

/*
ОБЩАЯ СУММА ДОХОДА С КОДОМ 2780
*/
declarationSchema.virtual('APPENDIX_4_050').get(function () {
  let result = 0;
  this.employers.forEach((employer, index) => {
    result += employer.income.reduce((a, b) => {
      if (b.code === "2780") {
        return a + b.amount;
      } else {
        return a;
      }
    }, 0);
  });
  if (result > 4000) result = 4000;
  return String(result);
});

/*
ОБЩАЯ СУММА ДОХОДА С КОДОМ 1211
*/
declarationSchema.virtual('APPENDIX_4_100').get(function () {
  let result = 0;
  this.employers.forEach((employer, index) => {
    result += employer.income.reduce((a, b) => {
      if (b.code === "1211") {
        return a + b.amount;
      } else {
        return a;
      }
    }, 0);
  });
  if (result > 12000) result = 12000;
  return String(result);
});

/*
ОБЩАЯ СУММА ДОХОДА С КОДАМИ 2762, 2720, 2760, 2780, 1211
*/
declarationSchema.virtual('APPENDIX_4_120').get(function () {
  let result = 0;
  result += Number(this.APPENDIX_4_010);
  result += Number(this.APPENDIX_4_020);
  result += Number(this.APPENDIX_4_040);
  result += Number(this.APPENDIX_4_050);
  result += Number(this.APPENDIX_4_100);
  return result;
});

/*
Сумма налога, подлежащая возврату из бюджета
*/
declarationSchema.virtual('UNIQUE_OKTMO').get(function () {
  let result = [];
  this.employers.forEach((employer) => {
    let finded = result.find((item) => {
      return item.oktmo === employer.oktmo;
    });
    if (finded) {
      finded.tax += employer.tax;
    } else {
      result.push({
        oktmo: employer.oktmo,
        tax: employer.tax,
        string_050: 0
      })
    }
  });
  let fullSum = Number(this.SECTION_2_160);
  result.forEach((item) => {
    if (fullSum > 0 && fullSum > item.tax) {
      item.string_050 = item.tax;
      fullSum -= item.tax;
    } else if (fullSum > 0 && fullSum <= item.tax) {
      item.string_050 = fullSum;
      fullSum = 0;
    } else if (fullSum === 0) {
      item.string_050 = 0;
    }
  });
  return result;
});


/*
Сумма налога, подлежащая возврату из бюджета
*/
declarationSchema.virtual('SECTION_1_050').get(function () {
  let result = Number(this.EMPLOYERS_TAX) - Number(this.SECTION_2_070);
  return String(result);
});

/*
Общая сумма доходов, за исключением доходов в виде сумм прибыли контролируемых иностранных компаний
*/
declarationSchema.virtual('SECTION_2_010').get(function () {
  let result = 0;
  result += this.APPENDIX_1.reduce((sum, item) => sum + Number(item.s070), 0) || 0;
  return result;
});

/*
 Общая сумма доходов, за исключением доходов в виде сумм прибыли контролируемых иностранных компаний, не подлежащая налогообложению
*/
declarationSchema.virtual('SECTION_2_020').get(function () {
  let result = 0;
  let appendix_4_120 = this.APPENDIX_4_120 || 0;
  result += appendix_4_120;
  return result;
});

/*
Общая сумма доходов, за исключением доходов в виде сумм прибыли контролируемых иностранных компаний, подлежащая налогообложению
*/
declarationSchema.virtual('SECTION_2_030').get(function () {
  let result = 0;
  let section_2_010 = this.SECTION_2_010 || 0;
  let section_2_020 = this.SECTION_2_020 || 0;
  result += section_2_010 - section_2_020;
  return result;
});

/*
СУММА ВСЕХ НАЛОГОВЫХ ВЫЧЕТОВ
*/
declarationSchema.virtual('SECTION_2_040').get(function () {
  let result = 0;
  let appendix_5_200 = Number(this.APPENDIX_5_200) || 0;
  let appendix_6_160 = this.APPENDIX_6.s160 || 0;
  let section_2_030 = this.SECTION_2_030 || 0;
  result += appendix_5_200 + appendix_6_160;
  if (result > section_2_030) result = section_2_030;
  return result;
});

/*
НАЛОГОВАЯ БАЗА ДЛЯ ИСЧИСЛЕНИЯ НАЛОГА
Раздел 2. Расчет налоговой базы и суммы налога по доходам, облагаемым по ставке
строка 060
*/
declarationSchema.virtual('SECTION_2_060').get(function () {
  let result = 0;
  let section_2_030 = this.SECTION_2_030 || 0;
  let section_2_040 = this.SECTION_2_040 || 0;
  result += section_2_030 - section_2_040;
  return result;
});

/*
ОБЩАЯ СУММА НАЛОГА, ИСЧИСЛЕННАЯ К УПЛАТЕ
Раздел 2. Расчет налоговой базы и суммы налога по доходам, облагаемым по ставке
строка 070
*/
declarationSchema.virtual('SECTION_2_070').get(function () {
  let result = 0;
  let section_2_060 = this.SECTION_2_060 || 0;
  result += Math.round((section_2_060 * 13) / 100);
  return result;
});

/*
ОБЩАЯ СУММА НАЛОГА, ИСЧИСЛЕННАЯ К УПЛАТЕ
Раздел 2. Расчет налоговой базы и суммы налога по доходам, облагаемым по ставке
строка 070
*/
declarationSchema.virtual('SECTION_2_080').get(function () {
  let result = 0;
  let employers_tax = Number(this.EMPLOYERS_TAX) || 0;
  result += employers_tax;
  return result;
});

/*
Сумма налога, подлежащая возврату из бюджета
*/
declarationSchema.virtual('SECTION_2_150').get(function () {
  let result = 0;
  let section_2_070 = this.SECTION_2_070 || 0;
  let section_2_080 = this.SECTION_2_080 || 0;
  result += (section_2_070 - section_2_080) > 0 ? section_2_070 - section_2_080 : 0;
  return result;
});

/*
Сумма налога, подлежащая возврату из бюджета
*/
declarationSchema.virtual('SECTION_2_160').get(function () {
  let result = 0;
  let section_2_070 = this.SECTION_2_070 || 0;
  let section_2_080 = this.SECTION_2_080 || 0;
  result += (section_2_070 - section_2_080) <= 0 ? Math.abs(section_2_070 - section_2_080) : 0;
  return result;
  // let result = Number(this.EMPLOYERS_TAX) - Number(this.SECTION_2_070);
  // return String(result);
});

/*
РАСЧЕТ НАЛОГОВОГО ВЫЧЕТА ЗА КАЖДОГО РЕБЕНКА
8-030 Сумма стандартного налогового вычета на ребенка родителю, супругу (супруге) родителя, усыновителю, опекуну, попечителю, приемному родителю, супругу (супруге) приемного родителя
*/
declarationSchema.virtual('APPENDIX_5_030').get(function () {
  let result = this.child_18.concat(this.child_24).reduce((sum, child) => {
    return sum + (child.child_count === "3" ? 3000 : 1400);
  }, 0);
  return String(result * standart_coefficient(this.employers));
});

/*
РАСЧЕТ НАЛОГОВОГО ВЫЧЕТА ЗА КАЖДОГО РЕБЕНКА-ИНВАЛИДА
8-050 Сумма стандартного налогового вычета родителю, супругу (супруге) родителя, усыновителю, опекуну, попечителю, приемному родителю, супругу (супруге) приемного родителя на ребенка-инвалида в возрасте до 18 лет, на учащегося очной формы обучения, аспиранта, ординатора, интерна, студента, курсанта в возрасте до 24 лет, являющегося инвалидом I или II группы
*/
declarationSchema.virtual('APPENDIX_5_050').get(function () {
  let result = this.child_18.concat(this.child_24).filter(child => child.invalid).reduce((sum, child) => {
    return sum + 12000;
  }, 0);
  return String(result * standart_coefficient(this.employers));
});

function standart_coefficient(employers) {
  let salary = [];
  let result = 0;

  //Подсчет ежемесячных доходов от всех работодателей
  employers.forEach((employer) => {
    employer.month_income.forEach((value, index) => {
      salary[index] = salary[index] ? salary[index] + value : value;
    })
  });

  while (salary.length > 0) {
    if (salary[0] === null) {
      salary.shift()
    } else {
      break;
    }
  }

  //Расчет коэффициента
  salary.reduce((acc, val) => {
    acc += val;
    if (acc <= 350000) {
      result += 1;
    }
    return acc;
  }, 0);

  return result;
}

/*
РАСЧЕТ ОБЩЕЙ СУММЫ СТАНДАРТНОГО НАЛОГОВОГО ВЫЧЕТА
8-080 Общая сумма стандартных налоговых вычетов, заявляемая по налоговой декларации по налогу на доходы физических лиц (форма 3-НДФЛ) (далее – Декларация)
*/
declarationSchema.virtual('APPENDIX_5_080').get(function () {
  let result = 0;
  result += Number(this.APPENDIX_5_030);
  result += Number(this.APPENDIX_5_050);
  return String(result);
});

/*
РАСЧЕТ НАЛОГОВОГО ВЫЧЕТА НА ОБУЧЕНИЕ ДЕТЕЙ
8-100 Сумма, уплаченная за обучение детей в возрасте до 24 лет, подопечных в возрасте до 18 лет, бывших подопечных в возрасте до 24 лет по очной форме обучения
*/
declarationSchema.virtual('APPENDIX_5_100').get(function () {
  let result = 0;
  this.teach_child.forEach((teach) => {
    if (teach.amount < 50000) {
      result += teach.amount;
    } else {
      result += 50000;
    }
  });
  return String(result);
});

/*
РАСЧЕТ НАЛОГОВОГО ВЫЧЕТА ПО ДОРОГОСТОЯЩИМ ВИДАМ ЛЕЧЕНИЯ
8-110 Сумма расходов по дорогостоящим видам лечения
*/
declarationSchema.virtual('APPENDIX_5_110').get(function () {
  let result = 0;
  let heals = this.heal_me.concat(this.heal_child, this.heal_parent);
  heals.forEach((heal) => {
    if (heal.expensive) result += heal.expensive;
  });
  return String(result);
});

/*
РАСЧЕТ ОБЩЕЙ СУММЫ СОЦИАЛЬНЫХ НАЛОГОВЫХ ВЫЧЕТОВ БЕЗ ОГРАНИЧЕНИЙ
8-120 Общая сумма социальных налоговых вычетов, в отношении которых не применяется ограничение, установленное пунктом 2 статьи 219 Налогового кодекса Российской Федерации
*/
declarationSchema.virtual('APPENDIX_5_120').get(function () {
  let result = 0;
  result += Number(this.APPENDIX_5_110);
  result += Number(this.APPENDIX_5_100);
  return String(result);
});

/*
РАСЧЕТ НАЛОГОВОГО ВЫЧЕТА НА СВОЕ ОБУЧЕНИЕ ИЛИ ОБУЧЕНИЕ БРАТА/СЕСТРЫ
8-130 Сумма, уплаченная за свое обучение, за обучение брата (сестры) в возрасте до 24 лет по очной форме обучения
*/
declarationSchema.virtual('APPENDIX_5_130').get(function () {
  let result = 0;
  let teaches = this.teach_me.concat(this.teach_brother);
  teaches.forEach((teach) => {
    result += teach.amount;
  });
  result = result <= 120000 ? result : 120000;
  return String(result);
});

/*
РАСЧЕТ НАЛОГОВОГО ВЫЧЕТА ЗА ЛЕЧЕНИЕ (СВОЕ, ДЕТЕЙ, РОДИТЕЛЕЙ)
8-140 Сумма, уплаченная за медицинские услуги (за исключением расходов по дорогостоящим видам лечения) и лекарственные препараты для медицинского применения
*/
declarationSchema.virtual('APPENDIX_5_140').get(function () {
  let result = 0;
  let heals = this.heal_me.concat(this.heal_child, this.heal_parent);
  heals.forEach((heal) => {
    result += heal.amount;
    if (heal.medications) result += heal.medications;
  });
  if (Number(this.APPENDIX_5_130) + result <= 120000) {
    return String(result);
  } else {
    return String(120000 - Number(this.APPENDIX_5_130));
  }
});

/*
РАСЧЕТ ОБЩЕЙ СУММЫ СОЦИАЛЬНЫХ НАЛОГОВЫХ ВЫЧЕТОВ С ОГРАНИЧЕНИЕМ 120000р
8-180 Общая сумма социальных налоговых вычетов, в отношении которых применяется ограничение, установленное пунктом 2 статьи 219 Налогового кодекса Российской Федерации
*/
declarationSchema.virtual('APPENDIX_5_180').get(function () {
  let result = 0;
  result += Number(this.APPENDIX_5_130);
  result += Number(this.APPENDIX_5_140);
  return String(result);
});

/*
ОБЩАЯ СУММА СТАНДАРТНЫХ И СОЦИАЛЬНЫХ НАЛОГОВЫХ ВЫЧЕТОВ
8-200 Общая сумма стандартных и социальных налоговых вычетов, заявляемая по Декларации (руб. коп.)
*/
declarationSchema.virtual('APPENDIX_5_190').get(function () {
  let result = 0;
  result += Number(this.APPENDIX_5_120);
  result += Number(this.APPENDIX_5_180);
  return String(result);
});

/*
ОБЩАЯ СУММА СТАНДАРТНЫХ И СОЦИАЛЬНЫХ НАЛОГОВЫХ ВЫЧЕТОВ
8-200 Общая сумма стандартных и социальных налоговых вычетов, заявляемая по Декларации (руб. коп.)
*/
declarationSchema.virtual('APPENDIX_5_200').get(function () {
  let result = 0;
  result += Number(this.APPENDIX_5_080);
  result += Number(this.APPENDIX_5_120);
  result += Number(this.APPENDIX_5_180);
  return String(result);
});

/*
ОБЩАЯ СТОИМОСТЬ КУПЛЕННЫХ ОБЪЕКТОВ НЕДВИЖИМОСТИ
10-080 Сумма фактически произведенных расходов на новое строительство или приобретение объекта (без учета процентов по займам (кредитам), но не более предельного размера имущественного налогового вычета (руб. коп.)
*/
declarationSchema.virtual('ESTATE_080').get(function () {
  let result = 0;
  let estates = this.buy_house.concat(this.buy_land, this.buy_garage);
  estates.forEach((estate) => {
    result += estate.price;
  });
  if (result <= 2000000) {
    return String(result);
  } else {
    return "2000000";
  }
});

/*
ОБЩИЙ ДОХОД ЗА ГОД
10-140 Размер налоговой базы в отношении доходов, облагаемых по ставке, установленной пунктом 1 статьи 224 Налогового кодекса Российской Федерации, за минусом налоговых вычетов

!!! Это поле дублирует EMPLOYERS_INCOME

*/
declarationSchema.virtual('ESTATE_140').get(function () {
  let result = 0;
  this.employers.forEach((employer) => {
    result += employer.month_income.reduce((a, b) => a + b, 0);
  });
  return String(result);
});

/*
СУММА ДОКУМЕНТАЛЬНО ПОДТВЕРЖДЕННЫХ РАСХОДОВ
10-150 Сумма документально подтвержденных расходов на новое строительство или приобретение объекта, принимаемая для целей имущественного налогового вычета за отчетный налоговый период, на основании Декларации
*/
declarationSchema.virtual('ESTATE_150').get(function () {
  let result = 0;
  if (Number(this.ESTATE_140) <= Number(this.ESTATE_080)) {
    result = this.ESTATE_140
  } else {
    result = this.ESTATE_080
  }
  return String(result);
});

/*
ОСТАТОК ИМУЩЕСТВЕННОГО НАЛОГОВОГО ВЫЧЕТА
10-170 Остаток имущественного налогового вычета (без учета процентов по займам (кредитам), переходящий на следующий налоговый период
*/
declarationSchema.virtual('ESTATE_170').get(function () {
  let result = 0;
  result = Number(this.ESTATE_080) - Number(this.ESTATE_140);
  if (result < 0) result = 0;
  return String(result);
});

/*
ПРИЛОЖЕНИЕ 6
Расчет имущественных налоговых вычетов по доходам от продажи
имущества и имущественных прав, а также налоговых вычетов, установленных абзацем
вторым подпункта 2 пункта 2 статьи 220 Налогового кодекса Российской Федерации
*/
declarationSchema.virtual('APPENDIX_6').get(function () {
  let result = {};
  if (this.sell_estate.length + this.sell_transport.length) {
    result = {s010: 0, s020: 0, s030: 0, s040: 0, s050: 0, s060: 0, s070: 0, s080: 0, s160: 0};
    // this.sell_estate.filter(estate => estate.type !== "garage").forEach((estate) => {
    this.sell_estate.forEach((estate) => {
      //максимальная сумма вычета
      // let deduction = estate.type === "fraction" && estate.contract === "single" ? 10000 * estate.fraction_size : 1000000;
      let deduction = () => {
        if (estate.type === "house") {
          return 1000000;
        } else if (estate.type === "garage") {
          return 250000;
        } else if (estate.type === "fraction" && estate.contract === "multi") {
          return 1000000;
        } else if (estate.type === "fraction" && estate.contract === "single") {
          return 10000 * estate.fraction_size;
        }
      };
      //кадастровая стоимость недвижимости
      let kadastr_price = estate.type === "fraction" ? (estate.kadastr_price * estate.fraction_size * 7) / 1000 : (estate.kadastr_price * 7) / 10;
      //стоимость покупки
      let buy_price = estate.buy_price + (estate.mortgage ? estate.mortgage : 0);
      //стоимость продажи
      let sell_price = estate.sell_price;
      //поля для записи вычета и расходов
      let deduction_field = 0, expense_field = 0;
      if (buy_price >= deduction) {
        if (buy_price > sell_price) {
          if (sell_price > kadastr_price) {
            expense_field = sell_price;
          } else {
            if (buy_price < kadastr_price) {
              expense_field = buy_price;
            } else {
              expense_field = kadastr_price;
            }
          }
        } else {
          expense_field = buy_price;
        }
      } else {
        let my_deduction = sell_price <= kadastr_price ? kadastr_price : sell_price;
        deduction_field = my_deduction > deduction ? deduction : my_deduction;
      }
      if (estate.type === "fraction") {
        result.s030 += deduction_field;
        result.s040 += expense_field;
      } else if (estate.type === "house") {
        result.s010 += deduction_field;
        result.s020 += expense_field;
      } else if (estate.type === "garage") {
        result.s050 += deduction_field;
        result.s060 += expense_field;
      }
    });
    if (result.s010 > 1000000) result.s010 = 1000000;
    if (result.s030 > 1000000) result.s030 = 1000000;
    if (result.s050 > 250000) result.s050 = 250000;
    if (result.s010 + result.s030 > 1000000) {
      let r010 = result.s010 / ((result.s010 + result.s030) / 100);
      let r030 = result.s030 / ((result.s010 + result.s030) / 100);
      let over = ((result.s010 + result.s030) - 1000000) / 100;
      result.s010 -= r010 * over;
      result.s030 -= r030 * over;
    }
    this.sell_transport.forEach((transport) => {
      if (transport.buy_price >= 250000) {
        result.s080 += transport.buy_price > transport.sell_price ? transport.sell_price : transport.buy_price;
      } else {
        result.s070 += transport.sell_price;
      }
    });
    if (result.s070 > 250000) result.s070 = 250000;
    result.s160 = result.s010 + result.s020 + result.s030 + result.s040 + result.s050 + result.s060 + result.s070 + result.s080;
  }
  return result;
});

module.exports = mongoose.model('Declaration', declarationSchema);