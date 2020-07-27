const async = require('async');
const Declaration = require('../models/declaration');
const {PDFDocument, rgb} = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const rubles = require('rubles').rubles;
const dadata = require('dadata')('68a711e0219be1cfa1d4b1f58ff4491efaa81455', '9d9c6e22271dc83cf3cd300ca0f402abe181b4f7');
const axios = require('axios');

exports.checkForDownload = function (req, res, next) {
  Declaration.findOne({'_id': req.params.declarationId}, (err, declaration) => {
    if (process.env.NODE_ENV !== "production" && !declaration.FULLNESS.length) {
      next();
    } else if (declaration.payment && declaration.payment.status === "succeeded") {
      next();
    } else {
      res.redirect('/declarations');
    }
  });
};

exports.generate = function (req, res, next) {
  Declaration.findOne({'_id': req.params.declarationId}, (err, declaration) => {
    async.waterfall([
      function (cb) {
        if (!declaration.dadata.name.result) {
          dadata('name', [declaration.name], function (dadata_err, dadata_result) {
            if (dadata_err) {
              console.log(dadata_err);
            } else {
              declaration.dadata.name = dadata_result[0];
              declaration.save((mongoose_err, doc) => {
                if (mongoose_err) {
                  console.log(mongoose_err);
                } else {
                  cb(null);
                }
              })
            }
          })
        } else {
          cb(null);
        }
      },
      function (cb) {
        axios.post(`https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fns_unit`, {
          "query": declaration.ifns
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Token 68a711e0219be1cfa1d4b1f58ff4491efaa81455`
          }
        }).then((response) => {
          declaration.ifns_name = response.data.suggestions[0].value;
          declaration.save((mongoose_err, doc) => {
            if (mongoose_err) {
              console.log(mongoose_err);
            } else {
              cb(null);
            }
          })
        });
      }
    ], function (async_err) {
      let pdf = modifyPdf(declaration);
      pdf.then(function (pdf_result) {
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=3ndfl.pdf',
          'Content-Length': pdf_result.length
        });
        res.end(pdf_result);
      }, function (pdf_error) {
        console.log(pdf_error);
      });
    });
  });
};

async function modifyPdf(declaration) {

  const existingPdfBytes = fs.readFileSync('./public/3ndfl_src.pdf');
  const pdfDoc = await PDFDocument.create();
  const srcDoc = await PDFDocument.load(existingPdfBytes);

  const courierBytes = fs.readFileSync('./public/courier.ttf');
  const courierNormalBytes = fs.readFileSync('./public/courier_normal.ttf');
  const timesBytes = fs.readFileSync('./public/times.ttf');

  pdfDoc.registerFontkit(fontkit);
  const courier = await pdfDoc.embedFont(courierBytes);
  const courier_normal = await pdfDoc.embedFont(courierNormalBytes);
  const times = await pdfDoc.embedFont(timesBytes);

  var position, field;


  /*
  ПЕРВАЯ СТРАНИЦА
  */
  const [first] = await pdfDoc.copyPages(srcDoc, [0]);
  pdfDoc.addPage(first);
  first.setFont(courier);
  first.setFontColor(rgb(0, 0, 0));
  first.setFontSize(15);
  let height = first.getHeight();
  //ИНН
  first.drawText(declaration.inn, {x: 184.5, y: height - 28.1});
  //НОМЕР КОРРЕКТИРОВКИ
  first.drawText("0", {x: 91, y: height - 124});
  //НАЛОГОВЫЙ ПЕРИОД
  first.drawText("34", {x: 216, y: height - 124});
  //ГОД
  first.drawText(String(declaration.year), {x: 337.5, y: height - 124});
  //ИФНС
  first.drawText(String(declaration.ifns), {x: 525, y: height - 124});
  //КОД СТРАНЫ
  first.drawText("643", {x: 85, y: height - 179});
  //КОД КАТЕГОРИИ НАЛОГОПЛАТЕЛЬЩИКА
  first.drawText(String(declaration.category), {x: 341, y: height - 179});
  //ФАМИЛИЯ
  first.drawText(String(declaration.dadata.name.surname).toUpperCase(), {x: 85, y: height - 208});
  //ИМЯ
  first.drawText(String(declaration.dadata.name.name).toUpperCase(), {x: 85, y: height - 234});
  //ОТЧЕСТВО
  if (declaration.dadata.name.patronymic) {
    first.drawText(String(declaration.dadata.name.patronymic).toUpperCase(), {x: 85, y: height - 260});
  }
  //ДАТА РОЖДЕНИЯ
  first.drawText(String(declaration.birthdate).slice(0, 2), {x: 85, y: height - 290});
  first.drawText(String(declaration.birthdate).slice(3, 5), {x: 128, y: height - 290});
  first.drawText(String(declaration.birthdate).slice(6), {x: 170, y: height - 290});
  //МЕСТО РОЖДЕНИЯ
  if (declaration.birthplace.length > 17) {
    first.drawText(String(declaration.birthplace).slice(0, 17).toUpperCase(), {x: 341, y: height - 290});
    first.drawText(String(declaration.birthplace).slice(17).toUpperCase(), {x: 15, y: height - 316});
  } else {
    first.drawText(String(declaration.birthplace).toUpperCase(), {x: 341, y: height - 290});
  }
  //КОД ВИДА ДОКУМЕНТА
  first.drawText("21", {x: 128, y: height - 367});
  //СЕРИЯ И НОМЕР ПАСПОРТА
  first.drawText(String(declaration.passport_seria) + " " + String(declaration.passport_number), {
    x: 128,
    y: height - 393.5
  });
  //КЕМ ВЫДАН
  if (declaration.passport_issue_place.length > 17) {
    first.drawText(String(declaration.passport_issue_place).slice(0, 32).toUpperCase(), {
      x: 128,
      y: height - 419
    });
    first.drawText(String(declaration.passport_issue_place).slice(32).toUpperCase(), {
      x: 15,
      y: height - 445
    });
  } else {
    first.drawText(String(declaration.passport_issue_place).toUpperCase(), {x: 128, y: height - 419});
  }
  //ДАТА ВЫДАЧИ
  first.drawText(String(declaration.passport_issue_date).slice(0, 2), {x: 128, y: height - 471});
  first.drawText(String(declaration.passport_issue_date).slice(3, 5), {x: 171, y: height - 471});
  first.drawText(String(declaration.passport_issue_date).slice(6), {x: 213, y: height - 471});
  //КОД СТАТУСА НАЛОГОПЛАТЕЛЬЩИКА
  first.drawText("1", {x: 184.5, y: height - 503.5});
  //ТЕЛЕФОН
  first.drawText(String(declaration.phone), {x: 156, y: height - 532});
  //Достоверность и полноту сведений, указанных в настоящей декларации, подтверждаю
  first.drawText("1", {x: 34, y: height - 619});
  //Фамилия
  first.drawText(declaration.dadata.name.surname.toUpperCase(), {x: 20, y: height - 641.5});
  //Имя
  first.drawText(declaration.dadata.name.name.toUpperCase(), {x: 20, y: height - 664});
  //Отчество
  first.drawText(declaration.dadata.name.patronymic.toUpperCase(), {x: 20, y: height - 687});


  /*
  РАЗДЕЛ 1.
  Сведения о суммах налога, подлежащих уплате (доплате) в бюджет / возврату из бюджета
  */
  const [section_1] = await pdfDoc.copyPages(srcDoc, [1]);
  pdfDoc.addPage(section_1);
  section_1.setFont(courier);
  section_1.setFontColor(rgb(0, 0, 0));
  section_1.setFontSize(15);
  height = section_1.getHeight();
  //ИНН, ФАМИЛИЯ, ИМЯ, ОТЧЕСТВО
  section_1.drawText(declaration.inn, {x: 184.5, y: height - 28.1});
  section_1.drawText(declaration.dadata.name.surname, {x: 130, y: height - 70, font: courier_normal});
  section_1.drawText(declaration.dadata.name.name.slice(0, 1) + ".", {
    x: 475,
    y: height - 70,
    font: courier_normal
  });
  if (declaration.dadata.name.patronymic) section_1.drawText(declaration.dadata.name.patronymic.slice(0, 1) + ".", {
    x: 530,
    y: height - 70,
    font: courier_normal
  });
  declaration.UNIQUE_OKTMO.forEach((item, index) => {
    //010 ВОЗВРАТ ИЗ БЮДЖЕТА
    section_1.drawText("2", {x: 295, y: height - 156 - (205.5 * index)});
    //020 Код бюджетной классификации
    section_1.drawText("18210102010011000110", {x: 295, y: height - 195 - (205.5 * index)});
    //030 Код по ОКТМО
    section_1.drawText(item.oktmo, {x: 295, y: height - 235 - (205.5 * index)});
    //050 Сумма налога, подлежащая возврату из бюджета
    position = (13 - String(item.string_050).length) * 14.1;
    section_1.drawText(String(item.string_050), {x: 296 + position, y: height - 320 - (205.5 * index)});
  });


  /*
  РАЗДЕЛ 2.
  Расчет налоговой базы и суммы налога по доходам, облагаемым по ставке
  */
  const [section_2] = await pdfDoc.copyPages(srcDoc, [2]);
  pdfDoc.addPage(section_2);
  section_2.setFont(courier);
  section_2.setFontColor(rgb(0, 0, 0));
  section_2.setFontSize(15);
  height = section_2.getHeight();
  //ИНН, ФАМИЛИЯ, ИМЯ, ОТЧЕСТВО
  section_2.drawText(declaration.inn, {x: 184.5, y: height - 28.1});
  section_2.drawText(declaration.dadata.name.surname, {x: 130, y: height - 70, font: courier_normal});
  section_2.drawText(declaration.dadata.name.name.slice(0, 1) + ".", {
    x: 475,
    y: height - 70,
    font: courier_normal
  });
  if (declaration.dadata.name.patronymic) section_2.drawText(declaration.dadata.name.patronymic.slice(0, 1) + ".", {
    x: 530,
    y: height - 70,
    font: courier_normal
  });
  //001 Налоговая ставка
  section_2.drawText("13", {x: 496, y: height - 105});
  //002 Вид дохода
  section_2.drawText("3", {x: 286, y: height - 131});
  //010 Общая сумма доходов, за исключением доходов в виде сумм прибыли контролируемых иностранных компаний
  // field = breakNumber(declaration.EMPLOYERS_INCOME);
  field = breakNumber(declaration.SECTION_2_010);
  position = (13 - field[0].length) * 14.1;
  section_2.drawText(field[0], {x: 353 + position, y: height - 166});
  section_2.drawText(field[1], {x: 550, y: height - 166});
  //020 Общая сумма доходов, за исключением доходов в виде сумм прибыли контролируемых иностранных компаний, не подлежащая налогообложению
  if (declaration.SECTION_2_020 !== 0) {
    field = breakNumber(declaration.SECTION_2_020);
    position = (13 - field[0].length) * 14.1;
    section_2.drawText(field[0], {x: 353 + position, y: height - 196});
    section_2.drawText(field[1], {x: 550, y: height - 196});
  }
  //030 Общая сумма доходов, за исключением доходов в виде сумм прибыли контролируемых иностранных компаний, подлежащая налогообложению
  field = breakNumber(declaration.SECTION_2_030);
  position = (13 - field[0].length) * 14.1;
  section_2.drawText(field[0], {x: 353 + position, y: height - 236});
  section_2.drawText(field[1], {x: 550, y: height - 236});
  //040 Сумма налоговых вычетов
  field = breakNumber(declaration.SECTION_2_040);
  position = (13 - field[0].length) * 14.1;
  section_2.drawText(field[0], {x: 353 + position, y: height - 278});
  section_2.drawText(field[1], {x: 550, y: height - 278});
  //050 Сумма расходов, принимаемая в уменьшение полученных доходов
  section_2.drawText("0", {x: 522, y: height - 308});
  section_2.drawText("00", {x: 550, y: height - 308});
  //051 Общая сумма доходов в виде сумм прибыли контролируемых иностранных компаний
  section_2.drawText("0", {x: 522, y: height - 333});
  section_2.drawText("00", {x: 550, y: height - 333});
  //060 Налоговая база для исчисления налога
  field = breakNumber(declaration.SECTION_2_060);
  position = (13 - field[0].length) * 14.1;
  section_2.drawText(field[0], {x: 353 + position, y: height - 364});
  section_2.drawText(field[1], {x: 550, y: height - 364});
  //070 Общая сумма налога, исчисленная к уплате
  position = (13 - String(declaration.SECTION_2_070).length) * 14.1;
  section_2.drawText(String(declaration.SECTION_2_070), {x: 353 + position, y: height - 415});
  //080 Общая сумма налога, удержанная у источника выплаты
  position = (13 - String(declaration.SECTION_2_080).length) * 14.1;
  section_2.drawText(String(declaration.SECTION_2_080), {x: 353 + position, y: height - 440});
  //150 Сумма налога, подлежащая уплате (доплате) в бюджет
  if (declaration.SECTION_2_150) {
    position = (13 - String(declaration.SECTION_2_150).length) * 14.1;
    section_2.drawText(String(declaration.SECTION_2_150), {x: 353 + position, y: height - 654});
  }
  //160 Сумма налога, подлежащая возврату из бюджета
  if (declaration.SECTION_2_160) {
    position = (13 - String(declaration.SECTION_2_160).length) * 14.1;
    section_2.drawText(String(declaration.SECTION_2_160), {x: 353 + position, y: height - 680});
  }
  //   position = (13 - declaration.SECTION_2_160.length) * 14.1;
  // section_2.drawText(declaration.SECTION_2_160, {x: 353 + position, y: height - 680});


  /*
  ПРИЛОЖЕНИЕ 1.
  Доходы от источников в Российской Федерации
  */
  appendix_1 = [];
  for (let i = 0; i < Math.ceil(declaration.APPENDIX_1.length / 3); i++) {
    [appendix_1[i]] = await pdfDoc.copyPages(srcDoc, [3]);
    pdfDoc.addPage(appendix_1[i]);
    appendix_1[i].setFont(courier);
    appendix_1[i].setFontColor(rgb(0, 0, 0));
    appendix_1[i].setFontSize(15);
    height = appendix_1[i].getHeight();
    //ИНН, ФАМИЛИЯ, ИМЯ, ОТЧЕСТВО
    appendix_1[i].drawText(declaration.inn, {x: 184.5, y: height - 28.1});
    appendix_1[i].drawText(declaration.dadata.name.surname, {x: 130, y: height - 70, font: courier_normal});
    appendix_1[i].drawText(declaration.dadata.name.name.slice(0, 1) + ".", {
      x: 475,
      y: height - 70,
      font: courier_normal
    });
    if (declaration.dadata.name.patronymic) appendix_1[i].drawText(declaration.dadata.name.patronymic.slice(0, 1) + ".", {
      x: 530,
      y: height - 70,
      font: courier_normal
    });
  }

  let appendix_index = 0, appendix_position = 0;

  declaration.APPENDIX_1.forEach((item) => {
    //010 НАЛОГОВАЯ СТАВКА
    appendix_1[appendix_index].drawText(item.s010, {x: 119, y: height - 127.5 - (228.5 * appendix_position)});
    //020 КОД ВИДА ДОХОДА
    appendix_1[appendix_index].drawText(item.s020, {x: 550, y: height - 127.5 - (228.5 * appendix_position)});
    //030 ИНН ИСТОЧНИКА ВЫПЛАТЫ ДОХОДА
    if (item.s030) appendix_1[appendix_index].drawText(item.s030, {
      x: 15,
      y: height - 167.8 - (228.5 * appendix_position)
    });
    //040 КПП
    if (item.s040) appendix_1[appendix_index].drawText(item.s040, {
      x: 227,
      y: height - 167.8 - (228.5 * appendix_position)
    });
    //050 КОД ПО ОКТМО
    if (item.s050) appendix_1[appendix_index].drawText(item.s050, {
      x: 400,
      y: height - 167.8 - (228.5 * appendix_position)
    });
    //060 НАИМЕНОВАНИЕ ИСТОЧНИКА ВЫПЛАТЫ ДОХОДА
    breakToStrings(item.s060, 40).forEach((line, line_index) => {
      appendix_1[appendix_index].drawText(line.toUpperCase(), {
        x: 15,
        y: height - 208 - (228.5 * appendix_position) - (line_index * 23)
      });
    });
    //070 СУММА ДОХОДА
    let field = breakNumber(item.s070);
    position = (13 - field[0].length) * 14.1;
    appendix_1[appendix_index].drawText(field[0], {
      x: 15 + position,
      y: height - 318.5 - (228.5 * appendix_position)
    });
    appendix_1[appendix_index].drawText(field[1], {x: 213, y: height - 318.5 - (228.5 * appendix_position)});
    //080 СУММА НАЛОГА УДЕРЖАННАЯ
    position = (13 - item.s080.length) * 14.1;
    appendix_1[appendix_index].drawText(item.s080, {
      x: 315 + position,
      y: height - 318.5 - (228.5 * appendix_position)
    });
    appendix_position++;
    if (appendix_position === 3) {
      appendix_position = 0;
      appendix_index++;
    }
  });


  /*
  ПРИЛОЖЕНИЕ 4.
  Расчет суммы доходов, не подлежащей налогообложению
  */
  if (Number(declaration.APPENDIX_4_120) > 0) {
    const [appendix_4] = await pdfDoc.copyPages(srcDoc, [6]);
    pdfDoc.addPage(appendix_4);
    appendix_4.setFont(courier);
    appendix_4.setFontColor(rgb(0, 0, 0));
    appendix_4.setFontSize(15);
    height = appendix_4.getHeight();

    //ИНН, ФАМИЛИЯ, ИМЯ, ОТЧЕСТВО
    appendix_4.drawText(declaration.inn, {x: 184.5, y: height - 28.1});
    appendix_4.drawText(declaration.dadata.name.surname, {x: 130, y: height - 70, font: courier_normal});
    appendix_4.drawText(declaration.dadata.name.name.slice(0, 1) + ".", {
      x: 475,
      y: height - 70,
      font: courier_normal
    });
    if (declaration.dadata.name.patronymic) appendix_4.drawText(declaration.dadata.name.patronymic.slice(0, 1) + ".", {
      x: 530,
      y: height - 70,
      font: courier_normal
    });
    //010 Сумма единовременной материальной помощи, полученной от всех работодателей при рождении (усыновлении (удочерении) ребенка, не подлежащая налогообложению (руб. коп.)
    field = breakNumber(declaration.APPENDIX_4_010);
    position = (7 - field[0].length) * 14.1;
    appendix_4.drawText(field[0], {x: 437 + position, y: height - 113});
    appendix_4.drawText(field[1], {x: 550, y: height - 113});
    //020 Стоимость подарков, полученных от всех организаций или индивидуальных предпринимателей, не подлежащая налогообложению (руб. коп.)
    field = breakNumber(declaration.APPENDIX_4_020);
    position = (4 - field[0].length) * 14.1;
    appendix_4.drawText(field[0], {x: 479 + position, y: height - 159});
    appendix_4.drawText(field[1], {x: 550, y: height - 159});
    //040 Сумма материальной помощи, оказываемой работодателями своим работникам, а также бывшим своим работникам, уволившимся в связи с выходом на пенсию по инвалидности или по возрасту, не подлежащая налогообложению (руб. коп.)
    field = breakNumber(declaration.APPENDIX_4_040);
    position = (4 - field[0].length) * 14.1;
    appendix_4.drawText(field[0], {x: 479 + position, y: height - 261});
    appendix_4.drawText(field[1], {x: 550, y: height - 261});
    //050 Суммы возмещения (оплаты) всеми работодателями своим работникам, их супругам, родителям, детям (в том числе усыновленным), подопечным (в возрасте до 18 лет), бывшим своим работникам (пенсионерам по возрасту), а также инвалидам стоимости приобретенных ими (для них) лекарственных препаратов для медицинского применения, назначенных им лечащим врачом, не подлежащие налогообложению (руб. коп.)
    field = breakNumber(declaration.APPENDIX_4_050);
    position = (4 - field[0].length) * 14.1;
    appendix_4.drawText(field[0], {x: 479 + position, y: height - 317});
    appendix_4.drawText(field[1], {x: 550, y: height - 317});
    //100 Суммы взносов, уплаченных всеми работодателями в соответствии с Федеральным законом "О дополнительных страховых взносах на накопительную пенсию и государственной поддержке формирования пенсионных накоплений", не подлежащие налогообложению (руб. коп.)
    field = breakNumber(declaration.APPENDIX_4_100);
    position = (4 - field[0].length) * 14.1;
    appendix_4.drawText(field[0], {x: 479 + position, y: height - 663});
    appendix_4.drawText(field[1], {x: 550, y: height - 663});
    //120 Общая сумма доходов, не подлежащая налогообложению (руб. коп.)
    field = breakNumber(declaration.APPENDIX_4_120);
    position = (10 - field[0].length) * 14.1;
    appendix_4.drawText(field[0], {x: 395 + position, y: height - 753});
    appendix_4.drawText(field[1], {x: 550, y: height - 753});
  }


  /*
  ПРИЛОЖЕНИЕ 5.
  Расчет стандартных и социальных налоговых вычетов, а также инвестиционных
  налоговых вычетов, установленных статьей 219.1 Налогового кодекса Российской Федерации
  */
  if (declaration.child_18.length + declaration.child_24.length + declaration.heal_child.length + declaration.heal_me.length + declaration.heal_parent.length + declaration.teach_brother.length + declaration.teach_child.length + declaration.teach_me.length > 0) {
    const [appendix_5] = await pdfDoc.copyPages(srcDoc, [7]);
    pdfDoc.addPage(appendix_5);
    appendix_5.setFont(courier);
    appendix_5.setFontColor(rgb(0, 0, 0));
    appendix_5.setFontSize(15);
    height = appendix_5.getHeight();

    //ИНН, ФАМИЛИЯ, ИМЯ, ОТЧЕСТВО
    appendix_5.drawText(declaration.inn, {x: 184.5, y: height - 28.1});
    appendix_5.drawText(declaration.dadata.name.surname, {x: 130, y: height - 70, font: courier_normal});
    appendix_5.drawText(declaration.dadata.name.name.slice(0, 1) + ".", {
      x: 475,
      y: height - 70,
      font: courier_normal
    });
    if (declaration.dadata.name.patronymic) appendix_5.drawText(declaration.dadata.name.patronymic.slice(0, 1) + ".", {
      x: 530,
      y: height - 70,
      font: courier_normal
    });

    /* СТАНДАРНЫЕ ВЫЧЕТЫ */
    if (declaration.APPENDIX_5_030 !== "0") {
      field = breakNumber(declaration.APPENDIX_5_030);
      position = (6 - field[0].length) * 14.1;
      appendix_5.drawText(field[0], {x: 451 + position, y: height - 174});
      appendix_5.drawText(field[1], {x: 550, y: height - 174});
    }
    if (declaration.APPENDIX_5_050 !== "0") {
      field = breakNumber(declaration.APPENDIX_5_050);
      position = (6 - field[0].length) * 14.1;
      appendix_5.drawText(field[0], {x: 451 + position, y: height - 226});
      appendix_5.drawText(field[1], {x: 550, y: height - 226});
    }
    if (declaration.APPENDIX_5_080 !== "0") {
      field = breakNumber(declaration.APPENDIX_5_080);
      position = (6 - field[0].length) * 14.1;
      appendix_5.drawText(field[0], {x: 451 + position, y: height - 332});
      appendix_5.drawText(field[1], {x: 550, y: height - 332});
    }

    /* СОЦИАЛЬНЫЕ ВЫЧЕТЫ */
    if (declaration.APPENDIX_5_130 !== "0") {
      field = breakNumber(declaration.APPENDIX_5_130);
      position = (12 - field[0].length) * 14.1;
      appendix_5.drawText(field[0], {x: 367 + position, y: height - 497});
      appendix_5.drawText(field[1], {x: 550, y: height - 497});
    }
    if (declaration.APPENDIX_5_100 !== "0") {
      field = breakNumber(declaration.APPENDIX_5_100);
      position = (12 - field[0].length) * 14.1;
      appendix_5.drawText(field[0], {x: 367 + position, y: height - 400});
      appendix_5.drawText(field[1], {x: 550, y: height - 400});
    }
    if (declaration.APPENDIX_5_110 !== "0") {
      field = breakNumber(declaration.APPENDIX_5_110);
      position = (12 - field[0].length) * 14.1;
      appendix_5.drawText(field[0], {x: 367 + position, y: height - 424});
      appendix_5.drawText(field[1], {x: 550, y: height - 424});
    }
    if (declaration.APPENDIX_5_120 !== "0") {
      field = breakNumber(declaration.APPENDIX_5_120);
      position = (12 - field[0].length) * 14.1;
      appendix_5.drawText(field[0], {x: 367 + position, y: height - 449});
      appendix_5.drawText(field[1], {x: 550, y: height - 449});
    }
    if (declaration.APPENDIX_5_140 !== "0") {
      field = breakNumber(declaration.APPENDIX_5_140);
      position = (12 - field[0].length) * 14.1;
      appendix_5.drawText(field[0], {x: 367 + position, y: height - 522});
      appendix_5.drawText(field[1], {x: 550, y: height - 522});
    }
    if (declaration.APPENDIX_5_180 !== "0") {
      field = breakNumber(declaration.APPENDIX_5_180);
      position = (12 - field[0].length) * 14.1;
      appendix_5.drawText(field[0], {x: 367 + position, y: height - 656});
      appendix_5.drawText(field[1], {x: 550, y: height - 656});
    }
    if (declaration.APPENDIX_5_190 !== "0") {
      field = breakNumber(declaration.APPENDIX_5_190);
      position = (12 - field[0].length) * 14.1;
      appendix_5.drawText(field[0], {x: 367 + position, y: height - 707});
      appendix_5.drawText(field[1], {x: 550, y: height - 707});
    }
    if (declaration.APPENDIX_5_200 !== "0") {
      field = breakNumber(declaration.APPENDIX_5_200);
      let position = (12 - field[0].length) * 14.1;
      appendix_5.drawText(field[0], {x: 367 + position, y: height - 732});
      appendix_5.drawText(field[1], {x: 550, y: height - 732});
    }
  }


  /*
  РАСЧЕТ К ПРИЛОЖЕНИЮ 1.
  Расчет дохода от продажи объектов недвижимого имущества
  */
  appendix_1_calculation = [];
  for (let i = 0; i < Math.ceil(declaration.APPENDIX_1_CALCULATION.length / 4); i++) {
    [appendix_1_calculation[i]] = await pdfDoc.copyPages(srcDoc, [11]);
    pdfDoc.addPage(appendix_1_calculation[i]);
    appendix_1_calculation[i].setFont(courier);
    appendix_1_calculation[i].setFontColor(rgb(0, 0, 0));
    appendix_1_calculation[i].setFontSize(15);
    height = appendix_1_calculation[i].getHeight();
    //ИНН, ФАМИЛИЯ, ИМЯ, ОТЧЕСТВО
    appendix_1_calculation[i].drawText(declaration.inn, {x: 184.5, y: height - 28.1});
    appendix_1_calculation[i].drawText(declaration.dadata.name.surname, {
      x: 130,
      y: height - 70,
      font: courier_normal
    });
    appendix_1_calculation[i].drawText(declaration.dadata.name.name.slice(0, 1) + ".", {
      x: 475,
      y: height - 70,
      font: courier_normal
    });
    if (declaration.dadata.name.patronymic) appendix_1_calculation[i].drawText(declaration.dadata.name.patronymic.slice(0, 1) + ".", {
      x: 530,
      y: height - 70,
      font: courier_normal
    });
  }

  appendix_index = 0;
  appendix_position = 0;

  declaration.APPENDIX_1_CALCULATION.forEach((item) => {
    //010 Кадастровый номер отчужденного объекта недвижимого имущества
    breakToStrings(item.s010, 40).forEach((line, line_index) => {
      appendix_1_calculation[appendix_index].drawText(line.toUpperCase(), {
        x: 15,
        y: height - 120.5 - (169 * appendix_position) - (line_index * 23)
      });
    });
    //020 Кадастровая стоимость объекта недвижимого имущества
    field = breakNumber(item.s020);
    position = (13 - field[0].length) * 14.1;
    appendix_1_calculation[appendix_index].drawText(field[0], {
      x: 15 + position,
      y: height - 197.5 - (169 * appendix_position)
    });
    appendix_1_calculation[appendix_index].drawText(field[1], {x: 213, y: height - 197.5 - (169 * appendix_position)});
    //030 Сумма дохода от продажи объекта недвижимого имущества
    field = breakNumber(item.s030);
    position = (13 - field[0].length) * 14.1;
    appendix_1_calculation[appendix_index].drawText(field[0], {
      x: 335 + position,
      y: height - 197.5 - (169 * appendix_position)
    });
    appendix_1_calculation[appendix_index].drawText(field[1], {x: 533, y: height - 197.5 - (169 * appendix_position)});
    //040 Кадастровая стоимость, указанная в строке 020, с учетом коэффициента
    field = breakNumber(item.s040);
    position = (13 - field[0].length) * 14.1;
    appendix_1_calculation[appendix_index].drawText(field[0], {
      x: 15 + position,
      y: height - 251 - (169 * appendix_position)
    });
    appendix_1_calculation[appendix_index].drawText(field[1], {x: 213, y: height - 251 - (169 * appendix_position)});
    //050 Сумма дохода от продажи объекта недвижимого имущества в целях налогообложения налогом на доходы физических лиц
    field = breakNumber(item.s050);
    position = (13 - field[0].length) * 14.1;
    appendix_1_calculation[appendix_index].drawText(field[0], {
      x: 335 + position,
      y: height - 251 - (169 * appendix_position)
    });
    appendix_1_calculation[appendix_index].drawText(field[1], {x: 533, y: height - 251 - (169 * appendix_position)});

    appendix_position++;
    if (appendix_position === 4) {
      appendix_position = 0;
      appendix_index++;
    }
  });


  /*
  ПРИЛОЖЕНИЕ 6.
  Расчет имущественных налоговых вычетов по доходам от продажи
  имущества и имущественных прав, а также налоговых вычетов, установленных абзацем
  вторым подпункта 2 пункта 2 статьи 220 Налогового кодекса Российской Федерации
  */
  if (Object.entries(declaration.APPENDIX_6).length) {
    const [appendix_6] = await pdfDoc.copyPages(srcDoc, [8]);
    pdfDoc.addPage(appendix_6);
    appendix_6.setFont(courier);
    appendix_6.setFontColor(rgb(0, 0, 0));
    appendix_6.setFontSize(15);
    height = appendix_6.getHeight();

    //ИНН, ФАМИЛИЯ, ИМЯ, ОТЧЕСТВО
    appendix_6.drawText(declaration.inn, {x: 184.5, y: height - 28.1});
    appendix_6.drawText(declaration.dadata.name.surname, {x: 130, y: height - 70, font: courier_normal});
    appendix_6.drawText(declaration.dadata.name.name.slice(0, 1) + ".", {
      x: 475,
      y: height - 70,
      font: courier_normal
    });
    if (declaration.dadata.name.patronymic) appendix_6.drawText(declaration.dadata.name.patronymic.slice(0, 1) + ".", {
      x: 530,
      y: height - 70,
      font: courier_normal
    });

    //010 Сумма имущественного налогового вычета по доходам от продажи имущества (за исключением доли (долей) в указанном имуществе)
    if (declaration.APPENDIX_6.s010) {
      field = breakNumber(declaration.APPENDIX_6.s010);
      position = (7 - field[0].length) * 14.1;
      appendix_6.drawText(field[0], {x: 437 + position, y: height - 157});
      appendix_6.drawText(field[1], {x: 550, y: height - 157});
    }

    //020 Сумма фактически произведенных и документально подтвержденных расходов, связанных с приобретением имущества (за исключением доли (долей) в указанном имуществе)
    if (declaration.APPENDIX_6.s020) {
      field = breakNumber(declaration.APPENDIX_6.s020);
      position = (9 - field[0].length) * 14.1;
      appendix_6.drawText(field[0], {x: 409 + position, y: height - 183});
      appendix_6.drawText(field[1], {x: 550, y: height - 183});
    }

    //030 Сумма имущественного налогового вычета по доходам от продажи доли (долей) имущества
    if (declaration.APPENDIX_6.s030) {
      field = breakNumber(declaration.APPENDIX_6.s030);
      position = (7 - field[0].length) * 14.1;
      appendix_6.drawText(field[0], {x: 437 + position, y: height - 209});
      appendix_6.drawText(field[1], {x: 550, y: height - 209});
    }

    //040 Сумма фактически произведенных и документально подтвержденных расходов, связанных с приобретением доли (долей) имущества
    if (declaration.APPENDIX_6.s040) {
      field = breakNumber(declaration.APPENDIX_6.s040);
      position = (9 - field[0].length) * 14.1;
      appendix_6.drawText(field[0], {x: 409 + position, y: height - 235});
      appendix_6.drawText(field[1], {x: 550, y: height - 235});
    }

    //050 Сумма имущественного налогового вычета по доходам от продажи имущества
    if (declaration.APPENDIX_6.s050) {
      field = breakNumber(declaration.APPENDIX_6.s050);
      position = (6 - field[0].length) * 14.1;
      appendix_6.drawText(field[0], {x: 451 + position, y: height - 283});
      appendix_6.drawText(field[1], {x: 550, y: height - 283});
    }

    //060 Сумма фактически произведенных и документально подтвержденных расходов, связанных с приобретением имущества
    if (declaration.APPENDIX_6.s060) {
      field = breakNumber(declaration.APPENDIX_6.s060);
      position = (9 - field[0].length) * 14.1;
      appendix_6.drawText(field[0], {x: 409 + position, y: height - 309});
      appendix_6.drawText(field[1], {x: 550, y: height - 309});
    }

    //070 Сумма имущественного налогового вычета по доходам от продажи имущества
    if (declaration.APPENDIX_6.s070) {
      field = breakNumber(declaration.APPENDIX_6.s070);
      position = (6 - field[0].length) * 14.1;
      appendix_6.drawText(field[0], {x: 451 + position, y: height - 350});
      appendix_6.drawText(field[1], {x: 550, y: height - 350});
    }

    //080 Сумма фактически произведенных и документально подтвержденных расходов, связанных с приобретением имущества
    if (declaration.APPENDIX_6.s080) {
      field = breakNumber(declaration.APPENDIX_6.s080);
      position = (9 - field[0].length) * 14.1;
      appendix_6.drawText(field[0], {x: 409 + position, y: height - 375});
      appendix_6.drawText(field[1], {x: 550, y: height - 375});
    }

    //160 Общая сумма имущественных налоговых вычетов и расходов, принимаемых к вычету (руб. коп.)
    if (declaration.APPENDIX_6.s160) {
      field = breakNumber(declaration.APPENDIX_6.s160);
      position = (9 - field[0].length) * 14.1;
      appendix_6.drawText(field[0], {x: 409 + position, y: height - 745});
      appendix_6.drawText(field[1], {x: 550, y: height - 745});
    }
  }


  /*
  ПРИЛОЖЕНИЕ 7.
  Расчет имущественных налоговых вычетов по расходам на новое строительство
  либо приобретение объектов недвижимого имущества
  */
  for (let i = 0; i < declaration.APPENDIX_7.length; i++) {
    let [appendix_7] = await pdfDoc.copyPages(srcDoc, [9]);
    let item = declaration.APPENDIX_7[i];
    pdfDoc.addPage(appendix_7);
    appendix_7.setFont(courier);
    appendix_7.setFontColor(rgb(0, 0, 0));
    appendix_7.setFontSize(15);
    height = appendix_7.getHeight();
    //ИНН, ФАМИЛИЯ, ИМЯ, ОТЧЕСТВО
    appendix_7.drawText(declaration.inn, {x: 184.5, y: height - 28.1});
    appendix_7.drawText(declaration.dadata.name.surname, {x: 130, y: height - 70, font: courier_normal});
    appendix_7.drawText(declaration.dadata.name.name.slice(0, 1) + ".", {
      x: 475,
      y: height - 70,
      font: courier_normal
    });
    if (declaration.dadata.name.patronymic) appendix_7.drawText(declaration.dadata.name.patronymic.slice(0, 1) + ".", {
      x: 530,
      y: height - 70,
      font: courier_normal
    });
    appendix_7.drawText(item.s010, {x: 159, y: height - 133});
    appendix_7.drawText(item.s020, {x: 358, y: height - 133});
    appendix_7.drawText(item.s030, {x: 301, y: height - 165});
    breakToLines(item.s031, 40).forEach((line, line_index) => {
      appendix_7.drawText(line.toUpperCase(), {
        x: 15,
        y: height - 201 - (line_index * 23)
      });
    });
    breakToStrings(item.s032, 40).forEach((line, line_index) => {
      appendix_7.drawText(line.toUpperCase(), {
        x: 15,
        y: height - 260 - (line_index * 24)
      });
    });
    if (item.s040) {
      appendix_7.drawText(item.s040, {x: 122, y: height - 425});
    }
    if (item.s050) {
      appendix_7.drawText(item.s050, {x: 440, y: height - 425});
    }
    if (item.s060) {
      appendix_7.drawText(item.s060, {x: 122, y: height - 452});
    }
  }

  /*
  ГЕНЕРАЦИЯ ЗАЯВЛЕНИЯ
  */
  if (declaration.SECTION_2_160) {
    const [empty] = await pdfDoc.copyPages(srcDoc, [13]);
    pdfDoc.addPage(empty);
    empty.setFont(times);
    empty.setFontColor(rgb(0, 0, 0));
    height = empty.getHeight();

    empty.drawText(
      `В: ${declaration.ifns_name} \n` +
      `От: ${declaration.dadata.name.result_genitive} \n` +
      `ИНН: ${declaration.inn} \n` +
      `Проживающего по адресу: ${declaration.address} \n`,
      {
        x: 275,
        y: height - 50,
        size: 14,
        lineHeight: 20,
        maxWidth: 300
      },
    );
    empty.drawText(`ЗАЯВЛЕНИЕ`, {x: 250, y: height - 300, size: 16});
    empty.drawText(
      `На основании пункта 6 статьи 78 Налогового кодекса Российской Федерации прошу вернуть мне сумму излишне уплаченного в ${declaration.year} году налога на доходы физических  лиц в размере ${declaration.SECTION_1_050} руб. (${rubles(declaration.SECTION_1_050)}) в связи с предоставлением мне имущественного/социального налогового вычета по налогу на доходы физических лиц.\n` +
      `Указанную сумму налога прошу перечислить на мой банковский счет по следующим реквизитам:\n` +
      `Наименование банка: ${declaration.bank_name}\n` +
      `ИНН: ${declaration.bank_inn}, ` +
      `БИК: ${declaration.bank_bik}, ` +
      `КПП: ${declaration.bank_kpp}\n` +
      `Корреспондентский счет: ${declaration.bank_correspondent_account}\n` +
      `Лицевой счет налогоплательщика: ${declaration.bank_personal_account}\n`,
      {
        x: 50,
        y: height - 350,
        size: 14,
        lineHeight: 20,
        maxWidth: 495
      },
    );
    empty.drawText(`Дата:`, {x: 50, y: height - 800, size: 14});
    empty.drawText(`Подпись:`, {x: 266, y: height - 800, size: 14});
    empty.drawText(`расшифровка подписи`, {x: 450, y: height - 810, size: 9});
    empty.drawLine({
      start: {x: 90, y: height - 800},
      end: {x: 190, y: height - 800},
      thickness: 0.5,
      color: rgb(0.75, 0.75, 0.75)
    });
    empty.drawLine({
      start: {x: 330, y: height - 800},
      end: {x: 430, y: height - 800},
      thickness: 0.5,
      color: rgb(0.75, 0.75, 0.75)
    });
    empty.drawLine({
      start: {x: 445, y: height - 800},
      end: {x: 545, y: height - 800},
      thickness: 0.5,
      color: rgb(0.75, 0.75, 0.75)
    });
  }

  // ДОБАВЛЯЮ НОМЕРА СТРАНИЦ
  const pages = pdfDoc.getPages();
  pages.pop();
  pages.forEach((page, index) => {
    page.drawText("00" + String(index + 1), {x: 341, y: height - 51, size: 15, font: courier});
  });
  //КОЛИЧЕСТВО СТРАНИЦ НА ПЕРВОМ ЛИСТЕ
  first.drawText(String(pdfDoc.getPageCount() - 1), {x: 133, y: height - 572.2});

  return await pdfDoc.save();
}

//отделяем целую часть от дробной, отдаем массив с двумя числами
function breakNumber(num) {
  let reg = /\-?(\d*)\.?(\d{0,2})/;
  var arr = reg.exec(String(num));
  arr.splice(0, 1);
  if (!arr[1]) {
    arr[1] = "00";
  }
  return arr;
}


//Разбивает строку на строки с переносом слов
function breakToStrings(text, line_length) {
  let result = [];
  let current = "";

  if (text.length <= line_length) {
    result.push(text);
  } else {
    let words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      if ((current.length + words[i].length + 1) <= line_length) {
        current += words[i] + " ";
      } else {
        result.push(current);
        current = "";
        current += words[i] + " ";
      }
      if (i === words.length - 1) {
        result.push(current);
      }
    }
  }
  return result;
}

//Разбивает строку на строки без переноса слов
function breakToLines(str, size) {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);
  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size)
  }
  return chunks
}
