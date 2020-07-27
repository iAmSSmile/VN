$(document).ready(function () {

  $("form").each(function (index) {
    addTooltips($(this));
    addMasks($(this));
    addSuggestions($(this));
    changeDateNames($(this));
  });

  function addMasks($form) {
    $form.find('input[name*="entity_inn"]').mask("000000000000");
    $form.find('input[name*="entity_kpp"]').mask("000000000");
    $form.find('input[name*="entity_oktmo"]').mask("00000000000");
    $form.find('input[name*="fraction_size"]').mask("00");
  }

  function addTooltips($form) {
    let formID = $($form).attr("id");
    let formName = formID.split('--')[0];
    switch (formName) {
      case "sell_estate":
        new jBox('Tooltip', {
          attach: `form#${formID} .buy-estate-help`,
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
          pointer: 'left:108',
          content: `Если проданную недвижимость вы не покупали, она досталось вам по наследству, в подарок, приватизирована - цена покупки должна быть равна 0`
        });
        new jBox('Tooltip', {
          attach: `form#${formID} .mortrage-help`,
          target: `form#${formID} input[name="mortgage"]`,
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
          content: `Если вы не покупали проданную недвижимость в ипотеку - поставьте в этом поле 0`
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

  function addSuggestions($form) {
    $form.find('input[name="address"]').suggestions({
      token: "68a711e0219be1cfa1d4b1f58ff4491efaa81455",
      type: "ADDRESS",
      scrollOnFocus: false,
      mobileWidth: 768,
      // onSelect: function (suggestion) {
      //   if (suggestion.data.tax_office) {
      //     $('input[name="ifns"]').addClass("input-filled");
      //     $('input[name="ifns"]').val(suggestion.data.tax_office);
      //   }
      // },
      // onSelectNothing: function () {
      //   $('input[name="ifns"]').removeClass("input-filled");
      //   $('input[name="ifns"]').val("");
      // }
    });
  }

  function addDates($form) {
    $form.find(".datedropper").flatpickr({
      "locale": "ru",
      dateFormat: "d.m.Y",
      allowInput: true,
      disableMobile: true
    });
  }

  $(document).on("change", `form[id*="sell_estate"] input[type="radio"][name="type"]`, function (event) {
    let form = $(this).parents('form');
    switchTypeForm(form, $(this).val());
  });

  $(document).on("change", `form[id*="sell_estate"] input[type="radio"][name="face"]`, function (event) {
    let form = $(this).parents('form');
    if ($(this).val() === "individual") {
      switchFaceForm(form, "individual");
    } else {
      switchFaceForm(form, "entity");
    }
    check_fullness();
  });

  $(document).on("keyup", `form[id*="sell_estate"] input[name="buy_price"]`, function (event) {
    let form = $(this).parents('form');
    let type = form.find(`input[type="radio"][name="type"]:checked`).val();
    let buy_price = Number($(this).val());
    if(buy_price > 0 && type !== "garage") {
      switchMortgageField(form, true);
    } else {
      switchMortgageField(form, false);
    }
  });

  function switchMortgageField($form, state) {
    if (state ) {
      $form.find(`input[name="mortgage"]`).parent().parent().removeClass("hidden");
    } else {
      $form.find(`input[name="mortgage"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
    }
  }

  function switchTypeForm($form, state) {
    let buy_price = Number($form.find(`input[name="buy_price"]`).val());
    if (state === "fraction") {
      if(buy_price > 0) {
        switchMortgageField($form, true);
      }
      $form.find(`input[name="sell_price"] + .input-label`).text("Стоимость продажи доли, руб.");
      $form.find(`input[name="buy_price"] + .input-label`).text("Стоимость покупки доли, руб.");
      $form.find(`input[name="fraction_size"]`).parent().parent().removeClass("hidden");
      $form.find(`.contract-form`).removeClass("hidden");
    } else if (state === "house") {
      if(buy_price > 0) {
        switchMortgageField($form, true);
      }
      $form.find(`input[name="sell_price"] + .input-label`).text("Стоимость продажи, руб.");
      $form.find(`input[name="buy_price"] + .input-label`).text("Стоимость покупки, руб.");
      $form.find(`input[name="fraction_size"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
      $form.find(`input[name="contract"][value="multi"]`).prop("checked", true);
      $form.find(`.contract-form`).addClass("hidden");
    } else if (state === "garage") {
      $form.find(`input[name="sell_price"] + .input-label`).text("Стоимость продажи, руб.");
      $form.find(`input[name="buy_price"] + .input-label`).text("Стоимость покупки, руб.");
      switchMortgageField($form, false);
      $form.find(`input[name="fraction_size"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
      $form.find(`input[name="contract"][value="multi"]`).prop("checked", true);
      $form.find(`.contract-form`).addClass("hidden");
    }
  }

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

  $(document).on("change", `form[id*="buy_estate"] input[type="radio"][name="type"]`, function (event) {
    let $form = $(this).parents('form');
    switch ($(this).val()) {
      case "room":
        $form.find(`input[name*="act_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        $form.find(`input[name*="registration_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        $form.find(`input[name*="land_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        break;
      case "flat":
        $form.find(`input[name*="act_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        $form.find(`input[name*="registration_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        $form.find(`input[name*="land_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        break;
      case "house":
        $form.find(`input[name*="act_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        $form.find(`input[name*="registration_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        $form.find(`input[name*="land_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        break;
      case "land":
        $form.find(`input[name*="act_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        $form.find(`input[name*="registration_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        $form.find(`input[name*="land_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        break;
      case "land_and_house":
        $form.find(`input[name*="act_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        $form.find(`input[name*="registration_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        $form.find(`input[name*="land_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        break;
    }
    if ($(this).val() === "land_and_house") {
      $form.find(`input[name*="land_and_house_together"]`).prop("checked", false);
      $form.find(`.land_and_house_together`).removeClass("hidden");
    } else {
      $form.find(`.land_and_house_together`).addClass("hidden");
    }
    changeDateNames($form);
  });

  $(document).on("change", `form[id*="buy_estate"] input[type="checkbox"][name*="type_fraction"]`, function (event) {
    let $form = $(this).parents('form');
    changeDateNames($form);
  });

  $(document).on("change", `form[id*="buy_estate"] input[type="checkbox"][name*="land_and_house_together"]`, function (event) {
    let $form = $(this).parents('form');
    if ($(this).is(":checked")) {
      $form.find(`input[name*="registration_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
    } else {
      $form.find(`input[name*="registration_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
    }
    changeDateNames($form);
  });

  function changeDateNames ($form) {
    let type = $form.find(`input[type="radio"][name="type"]:checked`).val();
    let fraction = !!$form.find(`input[type="checkbox"][name*="type_fraction"]`).is(":checked");
    switch (type) {
      case "room":
        $form.find(`input[name*="registration_date"] + .input-label`).text(fraction ? "На долю в комнате" : "На комнату");
        $form.find(`input[name*="act_date"] + .input-label`).text(fraction ? "Дата акта о передаче доли в комнате" : "Дата акта о передаче комнаты");
        break;
      case "flat":
        $form.find(`input[name*="registration_date"] + .input-label`).text(fraction ? "На долю в квартире" : "На квартиру");
        $form.find(`input[name*="act_date"] + .input-label`).text(fraction ? "Дата акта о передаче доли в квартире" : "Дата акта о передаче квартиры");
        break;
      case "house":
        $form.find(`input[name*="registration_date"] + .input-label`).text(fraction ? "На долю в жилом доме" : "На жилой дом");
        break;
      case "land":
        $form.find(`input[name*="land_date"] + .input-label`).text(fraction ? "На долю в земельном участке" : "На земельный участок");
        break;
      case "land_and_house":
        $form.find(`input[name*="registration_date"] + .input-label`).text(fraction ? "На долю в жилом доме" : "На жилой дом");
        $form.find(`input[name*="land_date"] + .input-label`).text(fraction ? "На долю в земельном участке" : "На земельный участок");
        break;
    }
  }

  $(document).on("change", `form[id*="buy_estate"] input[type="radio"][name="number_type"]`, function (event) {
    let $form = $(this).parents('form');
    $form.find(`input[name="number"]`).val("").removeClass("input-filled");
    switch ($(this).val()) {
      case "1":
        $form.find(`input[name="number"]`).parent().removeClass("hidden");
        $form.find(`input[name="number"] + .input-label`).text("Кадастровый номер");
        break;
      case "2":
        $form.find(`input[name="number"]`).parent().removeClass("hidden");
        $form.find(`input[name="number"] + .input-label`).text("Условный номер");
        break;
      case "3":
        $form.find(`input[name="number"]`).parent().removeClass("hidden");
        $form.find(`input[name="number"] + .input-label`).text("Инвентарный номер");
        break;
      case "4":
        $form.find(`input[name="number"]`).parent().addClass("hidden");
        break;
    }
    check_fullness();
  });

  $(document).on("change", `form[id*="buy_estate"] input[type="checkbox"][name="owner_fraction:boolean"]`, function (event) {
    let $form = $(this).parents('form');
    if ($(this).is(":checked")) {
      $form.find(`.single-owner`).addClass("hidden");
      $form.find(`.multi-owner`).removeClass("hidden");
      $form.find(`.owner-label`).text("Владельцы недвижимости");
    } else {
      $form.find(`.single-owner`).removeClass("hidden");
      $form.find(`.multi-owner`).addClass("hidden");
      $form.find(`.owner-label`).text("Владелец недвижимости");
    }
  });

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
      case "buy_estate":
        $(".forms").append(`<form class="form" name="buy_estate" id="${formID}"> <a class="remove-form"></a> <div class="form-part"> <div class="form-part-header"> <div class="header">Покупка недвижимости</div> </div> <div class="row"> <div class="col-xs-12"> <div class="radio-block radio-vertical"> <input type="radio" id="${formID}-type1" name="type" value="room" checked> <label for="${formID}-type1">Комната</label> <input type="radio" id="${formID}-type2" name="type" value="flat"> <label for="${formID}-type2">Квартира</label> <input type="radio" id="${formID}-type3" name="type" value="house"> <label for="${formID}-type3">Жилой дом</label> <input type="radio" id="${formID}-type4" name="type" value="land"> <label for="${formID}-type4">Земельный участок</label> <input type="radio" id="${formID}-type5" name="type" value="land_and_house"> <label for="${formID}-type5">Земельный участок c купленным жилым домом</label> </div> </div> </div> <div class="row"> <div class="col-xs-12"> <div class="checkbox-block"> <input class="checkbox-field" type="checkbox" id="${formID}-type_fraction" name="type_fraction:boolean"> <label class="checkbox-label" for="${formID}-type_fraction">Куплена доля в недвижимости</label> <input class="land_and_house_together checkbox-field hidden" type="checkbox" id="${formID}-together" name="land_and_house_together:boolean"> <label class="land_and_house_together checkbox-label hidden" for="${formID}-together">Жилой дом куплен вместе с земельным участком по одному договору</label> </div> </div> </div> <div class="row"> <div class="col-xs-12"> <div class="input-block"> <input class="input-field" type="text" name="address"> <div class="input-label">Адрес</div> </div> </div> </div> <div class="row"><div class="col-xs-12 col-sm-6 col-md-4"><div class="select-block"><div class="select-wrapper"><select class="select-field" name="purchase_method"><option value="building">Новое строительство</option><option value="purchasing" selected>Приобретение</option></select></div><div class="select-label">Способ приобретения</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="buy_price"><div class="input-label">Стоимость покупки</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field input-filled" type="number" name="mortgage" value="0"><a class="input-help mortrage-help"></a><div class="input-label">Сумма выплаченных процентов по ипотеке</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Даты регистрации права собственности</div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-4 hidden"><div class="input-block"><input class="input-field datedropper" type="text" name="land_date"><div class="input-label">На долю в земельном участке</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field datedropper" type="text" name="registration_date"><div class="input-label">На комнату</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field datedropper" type="text" name="act_date"><div class="input-label">Дата акта о передаче комнаты</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Номер, присвоенный недвижимости</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-number1" name="number_type" value="1" checked><label for="${formID}-number1">Кадастровый</label><input type="radio" id="${formID}-number2" name="number_type" value="2"><label for="${formID}-number2">Условный</label><input type="radio" id="${formID}-number3" name="number_type" value="3"><label for="${formID}-number3">Инвентарный</label><input type="radio" id="${formID}-number4" name="number_type" value="4"><label for="${formID}-number4">Без номера</label></div></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="text" name="number"><div class="input-label">Кадастровый номер</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Информация о владельце недвижимости</div></div><div class="row"><div class="col-xs-12"><div class="checkbox-block"><input class="checkbox-field" type="checkbox" id="${formID}-fraction" name="owner_fraction:boolean"><label class="checkbox-label" for="${formID}-fraction">Недвижимость приобретена в общую долевую собственность</label></div></div></div><div class="row"><div class="col-xs-12"><div class="select-block"><div class="select-wrapper"><select class="select-field single-owner" name="owner"><option value="you" selected>Вы</option><option value="partner">Ваш супруг</option><option value="child">Ваш несовершеннолетний ребенок</option></select><select class="select-field multi-owner hidden" name="owners"><option value="you_and_child" selected>Вы и ваш несовершеннолетний ребенок</option><option value="partner_and_child">Ваш супруг и ваш несовершеннолетний ребенок</option></select></div><div class="select-label owner-label">Владелец недвижимости</div></div></div></div></div></form>`
        );
        break;
      case "sell_estate":
        $(".forms").append(
          `<form class="form" name="sell_estate" id="${formID}"><a class="remove-form"></a><div class="form-part"><div class="form-part-header"><a class="header">Продажа недвижимости<div class="toggle-conditions">показать условия</div></a><div class="conditions"><p>Недвижимость делится на две категории. 1 категория - дома, квартиры, комнаты, садовые домики, земельные участки и доли во всем этом. 2 категория - гаражи, сараи и прочее недвижимое имущество. Для категорий установлены разные сроки сладения. Если вы владели имуществом дольше установленного максимального срока, то декларация на продажу этого имущества не подается и налоги не платятся.</p><ul><li>Для 2 категории максимальный срок владения 5 лет</li><li>Если имущество 1 категории было куплено, то максимальный срок владения 5 лет</li><li>Если имущество 1 категории было унаследовано от близких родственников, приватизировано или являлось единственным жильем, то максимальный срок владения 3 года</li></ul></div></div><div class="row"><div class="col-xs-12"><div class="radio-block radio-vertical"><input type="radio" id="${formID}-house" name="type" value="house" checked><label for="${formID}-house">Дом, квартира, комната, садовый домик, земельный участок</label><input type="radio" id="${formID}-fraction" name="type" value="fraction"><label for="${formID}-fraction">Доля в доме, квартире, земельном участке</label><input type="radio" id="${formID}-garage" name="type" value="garage"><label for="${formID}-garage">Гараж, сарай и прочее недвижимое имущество</label></div></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="buy_price"><a class="input-help buy-estate-help"></a><div class="input-label">Стоимость покупки, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="sell_price"><div class="input-label">Стоимость продажи, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3 hidden"><div class="input-block"><input class="input-field" type="number" name="fraction_size"><div class="input-label">Размер доли, %</div></div></div><div class="col-xs-12 col-sm-6 col-md-3 hidden"><div class="input-block"><input class="input-field" type="number" name="mortgage"><a class="input-help mortrage-help"></a><div class="input-label">Сумма выплаченных процентов по ипотеке</div></div></div></div><div class="row contract-form hidden"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-multi_contract" name="contract" value="multi" checked=""><label for="${formID}-multi_contract">Эта доля продана отдельным контрактом</label><input type="radio" id="${formID}-single_contract" name="contract" value="single"><label for="${formID}-single_contract">Все доли проданы одним контрактом</label></div></div></div></div><div class="subform-part rosreestr"><div class="form-part-header"><div class="header">Информация из Росреестра</div><div class="description">Вам нужно указать кадастровый номер и кадастровую стоимость недвижимости. Заказать выписку или найти данные о недвижимости по ее адресу можно<a href="https://rosreestr.net/uznat-kadastrovuyu-stoimost-nedvijimosti" target="_blank"> здесь.</a></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="text" name="kadastr_number"><div class="input-label">Кадастровый номер</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="kadastr_price"><div class="input-label">Кадастровая стоимость, руб.</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Информация о покупателе</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-individual" name="face" value="individual" checked><label for="${formID}-individual">Физическое лицо</label><input type="radio" id="${formID}-entity" name="face" value="entity"><label for="${formID}-entity">Юридическое лицо</label></div></div></div><div class="row individual-form"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="individual_name" value=""><div class="input-label">ФИО покупателя</div></div></div></div><div class="row entity-form hidden"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="entity_name"><div class="input-label">Наименование юр. лица</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_oktmo"><div class="input-label">Код по ОКТМО</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_inn"><div class="input-label">ИНН</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_kpp"><div class="input-label">КПП</div></div></div></div></div></form>`
        );
        break;
      case "sell_transport":
        $(".forms").append(
          `<form class="form" name="sell_transport" id="${formID}"><a class="remove-form"></a><div class="form-part"><div class="form-part-header"><a class="header">Продажа транспорта<div class="toggle-conditions">показать условия</div></a><div class="conditions"><ul><li>Транспортное средство должно подлежать обязательной государственной регистрации</li><li>Вы владели этим траспортным средством менее 3 лет, в противном случае декларация не подается и налог не платится</li></ul></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="buy_price"><a class="input-help buy-transport-help"></a><div class="input-label">Стоимость покупки, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="sell_price"><div class="input-label">Стоимость продажи, руб.</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Покупатель</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-individual" name="face" value="individual" checked><label for="${formID}-individual">Физическое лицо</label><input type="radio" id="${formID}-entity" name="face" value="entity"><label for="${formID}-entity">Юридическое лицо</label></div></div></div><div class="row individual-form"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="individual_name"><div class="input-label">ФИО покупателя</div></div></div></div><div class="row entity-form hidden"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="entity_name"><div class="input-label">Наименование юр. лица</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_oktmo"><div class="input-label">Код по ОКТМО</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_inn"><div class="input-label">ИНН</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_kpp"><div class="input-label">КПП</div></div></div></div></div></form>`
        );
        break;
    }
    addTooltips($(`form[id="${formID}"]`));
    addMasks($(`form[id="${formID}"]`));
    addSuggestions($(`form[id="${formID}"]`));
    addDates($(`form[id="${formID}"]`));
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
        input[name="buy_price"]:visible,
        input[name="sell_price"],
        input[name="fraction_size"]:visible,
        input[name="mortgage"]:visible,
        input[name="kadastr_number"],
        input[name="kadastr_price"],
        input[name="individual_name"]:visible,
        input[name="entity_name"]:visible,
        input[name="entity_oktmo"]:visible,
        input[name="entity_inn"]:visible,
        input[name="entity_kpp"]:visible,
        input[name="number"]:visible,
        input[name="land_date"]:visible,
        input[name="registration_date"]:visible
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
      buy_estate: [],
      sell_estate: [],
      sell_transport: [],
    };
    $(`form[name="buy_estate"]`).each(function (index) {
      formObject.buy_estate.push($(this).serializeJSON());
    });
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
