$(document).ready(function () {

  const Interval = luxon.Interval;
  const DateTime = luxon.DateTime;

  $("form").each(function (index) {
    addTooltips($(this));
    addMasks($(this));
    check_dates($(this));
  });

  function addDatedropper($form) {
    $form.find(".datedropper").flatpickr({
      "locale": "ru",
      dateFormat: "d.m.Y",
      allowInput: true,
      disableMobile: true
    });
  }
  function addMasks($form) {
    $form.find('input[name*="entity_inn"]').mask("000000000000");
    $form.find('input[name*="entity_kpp"]').mask("000000000");
    $form.find('input[name*="entity_oktmo"]').mask("00000000000");
  }
  function addTooltips($form) {
    let formID = $($form).attr("id");
    let formName = formID.split('--')[0];
    switch (formName) {
      case "sell_estate":
        new jBox('Tooltip', {
          attach: `form#${formID} .single-help`,
          target: `form#${formID} .single-label`,
          theme: 'TooltipBorder',
          trigger: 'click',
          responsiveWidth: true,
          maxWidth: 500,
          adjustTracker: true,
          closeOnClick: 'body',
          closeOnEsc: true,
          animation: 'move',
          position: {
            x: 'center',
            y: 'bottom'
          },
          outside: 'y',
          pointer: 'left:108',
          content: `Проданная недвижимость являлась вашим единственным жильем на момент продажи или за 90 дней до продажи. Т.е. в течение 90 дней перед продажей квартиры вы могли купить другую, но продаваемая квартира все равно считалась бы единственным жильем.`
        });
        break;
      case "sell_transport":
        new jBox('Tooltip', {
          attach: `form#${formID} .buy-transport-help`,
          target: `form#${formID} input[name="buy_price"]`,
          theme: 'TooltipBorder',
          trigger: 'click',
          responsiveWidth: true,
          maxWidth: 500,
          adjustTracker: true,
          closeOnClick: 'body',
          closeOnEsc: true,
          animation: 'move',
          position: {
            x: 'center',
            y: 'bottom'
          },
          outside: 'y',
          pointer: 'left:88',
          content: `Если проданное транспортное средство вы не покупали, оно досталось вам по наследству, в подарок - цена покупки должна быть равна 0`
        });
        break;
    }
  }

  $(document).on("change", `input[type="radio"][name="type"]`, function (event) {
    let form = $(this).parents('form');
    if ($(this).val() === "garage") {
      switchFractionCheckbox(form, false);
      switchFractionForm(form, false);
      switchSingleCheckbox(form, false);
    } else {
      switchSingleCheckbox(form, true);
      switchFractionCheckbox(form, true);
    }
  });
  $(document).on("change", `input[type="checkbox"][name="fraction:boolean"]`, function (event) {
    let form = $(this).parents('form');
    if ($(this).prop("checked")) {
      switchFractionForm(form, true);
    } else {
      switchFractionForm(form, false);
    }
  });
  $(document).on("change", `input[type="radio"][name="how_to_buy"]`, function (event) {
    let form = $(this).parents('form');
    if ($(this).val() === "inherit") {
      switchHowToBuyForm(form, "inherit");
    } else {
      switchHowToBuyForm(form, "buy");
    }
    check_fullness();
  });
  $(document).on("change", `input[type="radio"][name="face"]`, function (event) {
    let form = $(this).parents('form');
    if ($(this).val() === "individual") {
      switchFaceForm(form, "individual");
    } else {
      switchFaceForm(form, "entity");
    }
    check_fullness();
  });
  $(document).on("change", `input[name="single:boolean"], input[name="get_date"], input[name="buy_date"], input[name="sell_date"]`, function (event) {
    check_dates($(this).parents('form'));
  });

  function switchFaceForm($form, state) {
    if (state === "individual") {
      $form.find(`input[name="entity_name"]`).val("").removeClass("input-filled");
      $form.find(`input[name="entity_oktmo"]`).val("").removeClass("input-filled");
      $form.find(`input[name="entity_inn"]`).val("").removeClass("input-filled");
      $form.find(`input[name="entity_kpp"]`).val("").removeClass("input-filled");
      $form.find(`.entity-form`).addClass("hidden");
      $form.find(`input[name="face"][value="individual"]`).prop("checked", true);
      $form.find(`.individual-form`).removeClass("hidden");
    } else {
      $form.find(`input[name="individual_name"]`).val("").removeClass("input-filled");
      $form.find(`.individual-form`).addClass("hidden");
      $form.find(`input[name="face"][value="entity"]`).prop("checked", true);
      $form.find(`.entity-form`).removeClass("hidden");
    }
  }
  function switchHowToBuyForm($form, state) {
    if (state === "buy") {
      $form.find(`input[name="get_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
      $form.find(`input[name="mortgage"]`).parent().parent().removeClass("hidden");
      $form.find(`input[name="buy_price"]`).parent().parent().removeClass("hidden");
      $form.find(`input[name="buy_date"]`).parent().parent().removeClass("hidden");
    } else {
      $form.find(`input[name="mortgage"]`).val("0").addClass("input-filled").parent().parent().addClass("hidden");
      $form.find(`input[name="buy_price"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
      $form.find(`input[name="buy_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
      $form.find(`input[name="get_date"]`).parent().parent().removeClass("hidden");
    }
  }
  function switchSingleCheckbox($form, state) {
    if (state) {
      $form.find(`input[name="single:boolean"]`).parent().removeClass("hidden");
    } else {
      $form.find(`input[name="single:boolean"]`).prop("checked", false);
      $form.find(`input[name="single:boolean"]`).parent().addClass("hidden");
    }
  }
  function switchFractionCheckbox($form, state) {
    if (state) {
      $form.find(`input[name="fraction:boolean"]`).parent().removeClass("hidden");
    } else {
      $form.find(`input[name="fraction:boolean"]`).prop("checked", false);
      $form.find(`input[name="fraction:boolean"]`).parent().addClass("hidden");
    }
  }
  function switchFractionForm($form, state) {
    if (state) {
      $form.find(`.fraction-form input[name="contract"][value="multi"]`).prop("checked", true);
      $form.find(`.fraction-form`).removeClass("hidden");
    } else {
      $form.find(`.fraction-form input[name="contract"][value="multi"]`).prop("checked", true);
      $form.find(`.fraction-form input[name="fraction_size"]`).val("100").addClass("input-filled");
      $form.find(`.fraction-form`).addClass("hidden");
    }
  }

  function check_dates($form) {
    $form.find(`.error-date`).addClass("hidden");
    let result = {
      allow: true,
      error: 0
    };
    let how_to_buy = $form.find(`input[name="how_to_buy"]:checked`).val();
    let single = $form.find(`input[name="single:boolean"]`).prop("checked");
    let start, end, duration, startDate, endDate;
    let year2016 = DateTime.local(2016, 1, 1);
    if ($form.find(`input[name="how_to_buy"]:checked`).val() === "buy") {
      start = $form.find(`input[name="buy_date"]`).val();
    } else {
      start = $form.find(`input[name="get_date"]`).val();
    }
    end = $form.find(`input[name="sell_date"]`).val();
    if (start && end) {
      startDate = DateTime.fromFormat(start, "dd.MM.yyyy");
      endDate = DateTime.fromFormat(end, "dd.MM.yyyy");
      duration = Interval.fromDateTimes(startDate, endDate).length('years');
      if (startDate > year2016) {
        $form.find(`input[name="kadastr_price"] + .input-label`).text(`Кадастровая стоимость на 01.01.${endDate.year}г., руб.`);
        $form.find(`.rosreestr .description`).html(`Вам нужно указать кадастровый номер и кадастровую стоимость недвижимости на 01.01.${endDate.year}г. Заказать выписку или найти данные о недвижимости по ее адресу можно <a href="https://rosreestr.net/uznat-kadastrovuyu-stoimost-nedvijimosti" target="_blank">здесь.</a>`);
      } else {
        $form.find(`input[name="kadastr_price"] + .input-label`).text(`Кадастровая стоимость, руб.`);
        $form.find(`.rosreestr .description`).html(`Вам нужно указать кадастровый номер и кадастровую стоимость недвижимости. Заказать выписку или найти данные о недвижимости по ее адресу можно <a href="https://rosreestr.net/uznat-kadastrovuyu-stoimost-nedvijimosti" target="_blank">здесь.</a>`);
      }
      if (startDate < year2016) {
        if (duration > 3) {
          result.allow = false;
          result.error = 3;
          $form.find(`.error-date`).removeClass("hidden");
          $form.find(`.error-date .error-block`).text("Вы владели этой недвижимостью более 3 лет. Вам не нужно указывать эту недвижимость в декларации и платить за нее налоги.")
        }
      } else {
        if (how_to_buy === "buy" && !single && duration > 5) {
          result.allow = false;
          result.error = 5;
          $form.find(`.error-date`).removeClass("hidden");
          $form.find(`.error-date .error-block`).text("Вы владели этой недвижимостью более 5 лет. Вам не нужно указывать эту недвижимость в декларации и платить за нее налоги.")
        }
        if ((how_to_buy === "inherit" || single) && duration > 3) {
          result.allow = false;
          result.error = 3;
          $form.find(`.error-date`).removeClass("hidden");
          $form.find(`.error-date .error-block`).text("Вы владели этой недвижимостью более 3 лет. Вам не нужно указывать эту недвижимость в декларации и платить за нее налоги.")
        }
      }
    } else {
      result.allow = false;
      $form.find(`input[name="kadastr_price"] + .input-label`).text(`Кадастровая стоимость, руб.`);
      $form.find(`.rosreestr .description`).html(`Вам нужно указать кадастровый номер и кадастровую стоимость недвижимости. Заказать выписку или найти данные о недвижимости по ее адресу можно <a href="https://rosreestr.net/uznat-kadastrovuyu-stoimost-nedvijimosti" target="_blank">здесь.</a>`);
    }
    return result;
  }

  $(document).on("click", "a.header", function (event) {
    $(this).toggleClass("conditions-open");
    if ($(this).hasClass("conditions-open")) {
      $(this).find('.toggle-conditions').text('скрыть условия');
    } else {
      $(this).find('.toggle-conditions').text('показать условия');
    }
  });

  $(document).on("click", ".remove-form", function (event) {
    $(this).parent().remove();
  });

  $(".add-form-button, .add-form .background").click(function () {
    if ($(".add-form-menu").css("display") === "block") {
      $(".add-form-menu, .add-form .background").css("display", "none");
    } else {
      $(".add-form-menu, .add-form .background").css("display", "block");
    }
  });

  $(".menu-link").click(function () {
    addForm($(this).attr("data-addform"));
  });

  function getNewFormIndex(formName) {
    if ($(`form[name="${formName}"]`).length) {
      return Number($(`form[name="${formName}"]`).last().attr("id").split("--")[1]) + 1;
    } else {
      return 0;
    }
  }

  function addForm(formName) {
    $(".add-form-menu, .add-form .background").css("display", "none");
    let formID = `${formName}--${getNewFormIndex(formName)}`;

    switch (formName) {
      case "sell_estate":
        $(".forms").append(
          `<form class="form" name="sell_estate" id="${formID}"><a class="remove-form"></a><div class="form-part"><div class="form-part-header"><div class="header">Продажа недвижимости</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-house" name="type" value="house" checked=""><label for="${formID}-house">Дом, квартира, комната, садовый домик, земельный участок</label><input type="radio" id="${formID}-garage" name="type" value="garage"><label for="${formID}-garage">Гараж, сарай и прочее недвижимое имущество</label></div></div><div class="col-xs-12"><div class="checkbox-block"><input class="checkbox-field" type="checkbox" id="${formID}-single" name="single:boolean"><label class="checkbox-label single-label" for="${formID}-single">Единственное жилье</label><a class="checkbox-help single-help"></a></div><div class="checkbox-block"><input class="checkbox-field" type="checkbox" id="${formID}-fraction" name="fraction:boolean"><label class="checkbox-label single-label" for="${formID}-fraction">Доля в недвижимости</label><a class="checkbox-help fraction-help"></a></div></div></div></div><div class="subform-part fraction-form hidden"><div class="form-part-header"><div class="header">Информация о доле</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-multi_contract" name="contract" value="multi" checked><label for="${formID}-multi_contract">Эта доля продана отдельным контрактом</label><input type="radio" id="${formID}-single_contract" name="contract" value="single"><label for="${formID}-single_contract">Все доли проданы одним контрактом</label></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field input-filled" type="number" name="fraction_size" value="100"><div class="input-label">Размер доли, %</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Как вы приобрели проданную недвижимость, сколько ей владели, ее стоимость</div></div><div class="row"><div class="col-xs-12"><div class="radio-block radio-vertical"><input type="radio" id="${formID}-buy" name="how_to_buy" value="buy" checked><label for="${formID}-buy">Купили</label><input type="radio" id="${formID}-inherit" name="how_to_buy" value="inherit"><label for="${formID}-inherit">Унаследовали, получили в подарок, приватизировали, получили по договору ренты</label></div></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3 hidden"><div class="input-block"><input class="datedropper input-field" type="text" name="get_date"><a class="input-help"></a><div class="input-label">Дата начала владения</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="datedropper input-field" type="text" name="buy_date"><div class="input-label">Дата покупки</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="datedropper input-field" type="text" name="sell_date"><div class="input-label">Дата продажи</div></div></div></div><div class="row"><div class="col-xs-12 last-md error-date hidden"><div class="error-block">Вы владели этой недвижимостью более 3 лет. Вам не нужно подавать декларацию и платить налоги.</div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="buy_price"><div class="input-label">Стоимость покупки, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="sell_price"><div class="input-label">Стоимость продажи, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field input-filled" type="number" name="mortgage" value="0"><div class="input-label">Сумма выплаченных процентов по ипотеке</div></div></div></div></div><div class="subform-part rosreestr"><div class="form-part-header"><div class="header">Информация из Росреестра</div><div class="description">Вам нужно указать кадастровый номер и кадастровую стоимость недвижимости. Заказать выписку или найти данные о недвижимости по ее адресу можно <a href="https://rosreestr.net/uznat-kadastrovuyu-stoimost-nedvijimosti" target="_blank">здесь.</a></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="text" name="kadastr_number" value=""><div class="input-label">Кадастровый номер</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="kadastr_price"><div class="input-label">Кадастровая стоимость, руб.</div></div></div></div></div><div class="subform-part buyer-form"><div class="form-part-header"><div class="header">Информация о покупателе</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-individual" name="face" value="individual" checked><label for="${formID}-individual">Физическое лицо</label><input type="radio" id="${formID}-entity" name="face" value="entity"><label for="${formID}-entity">Юридическое лицо</label></div></div></div><div class="row individual-form"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="individual_name"><div class="input-label">ФИО покупателя</div></div></div></div><div class="row entity-form hidden"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="entity_name"><div class="input-label">Наименование юр. лица</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_oktmo"><div class="input-label">Код по ОКТМО</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_inn"><div class="input-label">ИНН</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_kpp"><div class="input-label">КПП</div></div></div></div></div></form>`
          // `<form class="form" name="sell_estate" id="${formID}"><a class="remove-form"></a><div class="form-part"><div class="form-part-header"><div class="header">Продажа недвижимости</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-house" name="type" value="house" checked><label for="${formID}-house">Дом, квартира, комната, садовый домик, земельный участок и доли во всем этом</label><input type="radio" id="${formID}-garage" name="type" value="garage"><label for="${formID}-garage">Гараж, сарай и прочее недвижимое имущество</label></div></div><div class="col-xs-12 single-form"><div class="checkbox-block"><input class="checkbox-field" type="checkbox" id="${formID}-single" name="single:boolean"><label class="checkbox-label single-label" for="${formID}-single">Единственное жилье</label><a class="checkbox-help single-help"></a></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Как вы приобрели проданную недвижимость, сколько ей владели, ее стоимость</div></div><div class="row"><div class="col-xs-12"><div class="radio-block radio-vertical"><input type="radio" id="${formID}-buy" name="how_to_buy" value="buy" checked=""><label for="${formID}-buy">Купили</label><input type="radio" id="${formID}-inherit" name="how_to_buy" value="inherit"><label for="${formID}-inherit">Унаследовали, получили в подарок, приватизировали, получили по договору ренты</label></div></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3 hidden"><div class="input-block"><input class="datedropper input-field" type="text" name="get_date"><a class="input-help"></a><div class="input-label">Дата начала владения</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="datedropper input-field" type="text" name="buy_date"><div class="input-label">Дата покупки</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="datedropper input-field" type="text" name="sell_date"><div class="input-label">Дата продажи</div></div></div><div class="col-xs-12 last-md error-date hidden"><div class="error-block">Вы владели этой недвижимостью более 3 лет. Вам не нужно подавать декларацию и платить налоги.</div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="buy_price"><div class="input-label">Стоимость покупки, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="sell_price"><div class="input-label">Стоимость продажи, руб.</div></div></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field input-filled" type="number" name="part" value="100"><div class="input-label">Ваша доля</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field input-filled" type="number" name="mortgage" value="0"><div class="input-label">Сумма выплаченных процентов по ипотеке</div></div></div></div></div><div class="subform-part rosreestr"><div class="form-part-header"><div class="header">Информация из Росреестра</div><div class="description">Вам нужно указать кадастровый номер и кадастровую стоимость недвижимости. Заказать выписку или найти данные о недвижимости по ее адресу можно <a href="https://rosreestr.net/uznat-kadastrovuyu-stoimost-nedvijimosti" target="_blank">здесь.</a></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="text" name="kadastr_number" value=""><div class="input-label">Кадастровый номер</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="kadastr_price"><div class="input-label">Кадастровая стоимость, руб.</div></div></div></div></div><div class="subform-part buyer-form"><div class="form-part-header"><div class="header">Информация о покупателе</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-individual" name="face" value="individual" checked><label for="${formID}-individual">Физическое лицо</label><input type="radio" id="${formID}-entity" name="face" value="entity"><label for="${formID}-entity">Юридическое лицо</label></div></div></div><div class="row individual-form"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="individual_name"><div class="input-label">ФИО покупателя</div></div></div></div><div class="row entity-form hidden"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="entity_name"><div class="input-label">Наименование юр. лица</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_oktmo"><div class="input-label">Код по ОКТМО</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_inn"><div class="input-label">ИНН</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_kpp"><div class="input-label">КПП</div></div></div></div></div></form>`
        );
        break;
      case "sell_transport":
        $(".forms").append(
          `<form class="form" name="sell_transport" id="${formID}"><a class="remove-form"></a><div class="form-part"><div class="form-part-header"><a class="header">Продажа транспорта<div class="toggle-conditions">показать условия</div></a><ul class="conditions"><li>Транспортное средство должно подлежать обязательной государственной регистрации</li><li>Вы владели этим траспортным средством менее 3 лет, в противном случае декларация не подается и налог не платится</li></ul></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field input-filled" type="number" name="buy_price" value="0"><a class="input-help buy-transport-help"></a><div class="input-label">Стоимость покупки, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="sell_price"><div class="input-label">Стоимость продажи, руб.</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Покупатель</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-individual" name="face" value="individual" checked><label for="${formID}-individual">Физическое лицо</label><input type="radio" id="${formID}-entity" name="face" value="entity"><label for="${formID}-entity">Юридическое лицо</label></div></div></div><div class="row individual-form"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="individual_name"><div class="input-label">ФИО покупателя</div></div></div></div><div class="row entity-form hidden"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="entity_name"><div class="input-label">Наименование юр. лица</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="text" name="entity_oktmo"><div class="input-label">Код по ОКТМО</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="text" name="entity_inn"><div class="input-label">ИНН</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="text" name="entity_kpp"><div class="input-label">КПП</div></div></div></div></div></form>`
        );
        break;
    }
    addTooltips($(`form[id="${formID}"]`));
    addDatedropper($(`form[id="${formID}"]`));
    addMasks($(`form[id="${formID}"]`));
    // addSuggestions(formID);
    check_fullness();
  }

  //Проверка на заполнение при удалении формы
  $(document).on("click", "a", function () {
    check_fullness();
  });

  //Проверка на заполнение при редактировании поля
  $(document).on("keyup", "input", function () {
    check_fullness();
  });

  check_fullness();

  function check_fullness() {
    let empty = $(`
        input[name="get_date"]:visible,
        input[name="buy_date"]:visible,
        input[name="sell_date"],
        input[name="buy_price"]:visible,
        input[name="part"],
        input[name="mortgage"]:visible,
        input[name="sell_price"],
        input[name="kadastr_number"],
        input[name="kadastr_price"],
        input[name="individual_name"]:visible,
        input[name="entity_name"]:visible,
        input[name="entity_oktmo"]:visible,
        input[name="entity_inn"]:visible,
        input[name="entity_kpp"]:visible
    `).filter(function (index) {
      return !$(this).val();
    });
    if ($(empty).length === 0 && $(`form`).length > 0) {
      $(".step-footer").addClass("step-footer--filled");
    } else {
      $(".step-footer").removeClass("step-footer--filled");
    }
  }

  $(".forward, .backward").click(function () {
    postFormAndRedirect($(this).attr("data-redirect"));
  });

  function postFormAndRedirect(url) {
    let formObject = {
      sell_estate: [],
      sell_transport: [],
    };
    $(`form[name="sell_estate"]`).each(function (index) {
      formObject.sell_estate.push($(this).serializeJSON());
    });
    $(`form[name="sell_transport"]`).each(function (index) {
      formObject.sell_transport.push($(this).serializeJSON());
    });
    formObject.last_edit = new Date();
    $.ajax({
      type: "POST",
      url: "#",
      data: JSON.stringify(formObject),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        if (data.validation_errors) {
          validation_errors(data.validation_errors);
        } else {
          window.location.href = url;
        }
      }
    });
  }

  function validation_errors(err) {
    $(`.input-error`).remove();
    let errors = JSON.parse(err);
    console.log(errors);
    for (const field in errors) {
      let path = field.split('.');
      let formName = path[0];
      let formIndex = Number(path[1]);
      let fieldName = path[2];
      $(`<div class="input-error"> ${errors[field]} </div>`).insertBefore($(`form[name="${formName}"]:eq(${formIndex}) input[name="${fieldName}"]`));
    }
    let dest = $(`.input-error:eq(0)`).offset().top - 180;
    $('html, body').animate({scrollTop: dest}, 600);
    toastr.warning('Исправьте ошибки в заполненных полях, чтобы перейти к другому шагу.');
  }

});
