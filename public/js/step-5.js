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
      case "buy_estate":
        new jBox('Tooltip', {
          attach: `form#${formID} .mortgage-help`,
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
          content: `Укажите в этом поле сумму фактически произведенных вами расходов на погашение процентов по целевым займам (кредитам) или 0, если вы не пользовались кредитом при покупке`
        });
        new jBox('Tooltip', {
          attach: `form#${formID} .act-date-help`,
          target: `form#${formID} input[name="act_date"]`,
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
          content: `Необязательное поле, указывается если у вас есть акт передачи собственности`
        });
        new jBox('Tooltip', {
          attach: `form#${formID} .prev-sum-help`,
          target: `form#${formID} input[name="prev_sum"]`,
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
          content: `Сумма имущественного налогового вычета по расходам на новое строительство или приобретение объекта, принятая к учету при определении налоговой базы за предыдущие налоговые периоды`
        });
        new jBox('Tooltip', {
          attach: `form#${formID} .prev-percent-help`,
          target: `form#${formID} input[name="prev_percent"]`,
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
          content: `Сумма имущественного налогового вычета по уплаченным процентам по займам (кредитам), принятая к учету при определении налоговой базы за предыдущие налоговые периоды`
        });
        new jBox('Tooltip', {
          attach: `form#${formID} .prev-employer-help`,
          target: `form#${formID} input[name="prev_employer"]`,
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
          content: `Сумма имущественного налогового вычета (без учета процентов по займам (кредитам), предоставленная в отчетном налоговом периоде налоговым(и) агентом(ами) на основании уведомления, выданного налоговым органом`
        });
        new jBox('Tooltip', {
          attach: `form#${formID} .prev-employer-percent-help`,
          target: `form#${formID} input[name="prev_employer_percent"]`,
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
          content: `Сумма имущественного налогового вычета по уплаченным процентам по займам (кредитам), предоставленная в отчетном налоговом периоде налоговым(и) агентом(ами) на основании уведомления, выданного налоговым органом`
        });
        break;
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
          attach: `form#${formID} .mortgage-help`,
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
          content: `Если вы не покупали проданную недвижимость в ипотеку - поставьте в этом поле 0, в противном случае введите сумму выплаченных процентов по ипотеке`
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
      mobileWidth: 768
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
    if (buy_price > 0 && type !== "garage") {
      switchMortgageField(form, true);
    } else {
      switchMortgageField(form, false);
    }
  });

  function switchMortgageField($form, state) {
    if (state) {
      $form.find(`input[name="mortgage"]`).parent().parent().removeClass("hidden");
    } else {
      $form.find(`input[name="mortgage"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
    }
  }

  function switchTypeForm($form, state) {
    let buy_price = Number($form.find(`input[name="buy_price"]`).val());
    if (state === "fraction") {
      if (buy_price > 0) {
        switchMortgageField($form, true);
      }
      $form.find(`input[name="sell_price"] + .input-label`).text("Стоимость продажи доли, руб.");
      $form.find(`input[name="buy_price"] + .input-label`).text("Стоимость покупки доли, руб.");
      $form.find(`input[name="fraction_size"]`).parent().parent().removeClass("hidden");
      $form.find(`.contract-form`).removeClass("hidden");
    } else if (state === "house") {
      if (buy_price > 0) {
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
        switchType_3($form, false);
        switchType_4($form, false);
        break;
      case "flat":
        $form.find(`input[name*="act_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        $form.find(`input[name*="registration_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        $form.find(`input[name*="land_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        switchType_3($form, false);
        switchType_4($form, false);
        break;
      case "house":
        $form.find(`input[name*="act_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        $form.find(`input[name*="registration_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        $form.find(`input[name*="land_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        switchType_3($form, true);
        switchType_4($form, false);
        break;
      case "land":
        $form.find(`input[name*="act_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        $form.find(`input[name*="registration_date"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
        $form.find(`input[name*="land_date"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
        switchType_3($form, false);
        switchType_4($form, true);
        break;
    }
    changeDateNames($form);
  });

  function switchType_3($form, state) {
    if (state) {
      $form.find(`.type-3`).removeClass(`hidden`);
    } else {
      $form.find(`.type-3`).addClass(`hidden`);
      $form.find(`.type-3 input[type="checkbox"][name*="type3"]`).prop("checked", false);
    }
  }

  function switchType_4($form, state) {
    if (state) {
      $form.find(`.type-4`).removeClass(`hidden`);
    } else {
      $form.find(`.type-4`).addClass(`hidden`);
      $form.find(`.type-4 input[name*="type4"][value="construction"]`).prop("checked", true);
    }
  }

  $(document).on("change", `form[id*="buy_estate"] input[type="checkbox"][name*="type_fraction"]`, function (event) {
    let $form = $(this).parents('form');
    if ($(this).is(":checked")) {
      $form.find(`.type label[for*="type1"]`).text(`В комнате`);
      $form.find(`.type label[for*="type2"]`).text(`В квартире`);
      $form.find(`.type label[for*="type3"]`).text(`В жилом доме`);
      $form.find(`.type label[for*="type4"]`).text(`В земельном участке`);
    } else {
      $form.find(`.type label[for*="type1"]`).text(`Комната`);
      $form.find(`.type label[for*="type2"]`).text(`Квартира`);
      $form.find(`.type label[for*="type3"]`).text(`Жилой дом`);
      $form.find(`.type label[for*="type4"]`).text(`Земельный участок`);
    }
    changeDateNames($form);
  });

  function changeDateNames($form) {
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

  $(document).on("change", `form[id*="buy_estate"] select[name="number_type"]`, function (event) {
    let $form = $(this).parents('form');
    if (this.value === "4") {
      $form.find(`input[name="number"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
    } else {
      $form.find(`input[name="number"]`).val("").removeClass("input-filled").parent().parent().removeClass("hidden");
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
        $(".forms").append(`
            <form class="form" name="buy_estate" id="${formID}">
                <a class="remove-form"></a>
                    <div class="form-part">
                        <div class="form-part-header">
                            <div class="header">Покупка недвижимости</div>
                        </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="checkbox-block">
                                <input class="checkbox-field" type="checkbox" id="${formID}-type_fraction" name="type_fraction:boolean">
                                <label class="checkbox-label" for="${formID}-type_fraction">Куплена доля</label>
                            </div>
                        </div>
                    </div>
                    <div class="row type">
                        <div class="col-xs-12">
                            <div class="choose-block">
                                <input type="radio" id="${formID}-type1" name="type" value="room" checked>
                                <label for="${formID}-type1">Комната</label>
                                <input type="radio" id="${formID}-type2" name="type" value="flat">
                                <label for="${formID}-type2">Квартира</label>
                                <input type="radio" id="${formID}-type3" name="type" value="house">
                                <label for="${formID}-type3">Жилой дом</label>
                                <input type="radio" id="${formID}-type4" name="type" value="land">
                                <label for="${formID}-type4">Земельный участок</label>
                            </div>
                        </div>
                    </div>
                    <div class="row type-3 hidden">
                        <div class="col-xs-12">
                            <div class="checkbox-block">
                                <input class="checkbox-field" type="checkbox" id="${formID}-type3_land" name="type3:boolean">
                                <label class="checkbox-label" for="${formID}-type3_land">Жилой дом вместе с земельным участком</label>
                            </div>
                        </div>
                    </div>
                    <div class="row type-4 hidden">
                        <div class="col-xs-12">
                            <div class="radio-block">
                                <input type="radio" id="${formID}-type4_construction" name="type4" value="construction" checked>
                                <label for="${formID}-type4_construction">под жилищное строительство</label>
                                <input type="radio" id="${formID}-type4_house" name="type4" value="house">
                                <label for="${formID}-type4_house">с купленным ранее жилым домом</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="input-block">
                                <input class="input-field" type="text" name="address">
                                <div class="input-label">Адрес</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="buy_price"><div class="input-label">Стоимость покупки</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="mortgage"><a class="input-help mortgage-help"></a><div class="input-label">Сумма выплаченных процентов по ипотеке</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Даты регистрации права собственности</div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-4 hidden"><div class="input-block"><input class="datedropper input-field" type="text" name="land_date"><div class="input-label">На земельный участок</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="datedropper input-field" type="text" name="registration_date"><div class="input-label">На комнату</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="datedropper input-field" type="text" name="act_date" value=""><a class="input-help act-date-help"></a><div class="input-label">Дата акта о передаче</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Номер, присвоенный недвижимости</div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-4"><div class="select-block"><div class="select-wrapper"><select class="select-field" name="number_type"><option value="1" selected>Кадастровый</option><option value="2">Условный</option><option value="3">Инвентарный</option><option value="4">Нет номера</option></select></div><div class="select-label">Тип номера</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="text" name="number"><div class="input-label">Номер</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Информация о владельце недвижимости</div></div><div class="row"><div class="col-xs-12"><div class="checkbox-block"><input class="checkbox-field" type="checkbox" id="${formID}-fraction" name="owner_fraction:boolean"><label class="checkbox-label" for="${formID}-fraction">Недвижимость приобретена в общую долевую собственность</label></div></div></div><div class="row"><div class="col-xs-12"><div class="select-block"><div class="select-wrapper"><select class="select-field single-owner" name="owner"><option value="you" selected>Вы</option><option value="partner">Ваш супруг</option><option value="child">Ваш несовершеннолетний ребенок</option></select><select class="select-field multi-owner hidden" name="owners"><option value="you_and_child" selected>Вы и ваш несовершеннолетний ребенок</option><option value="partner_and_child">Ваш супруг и ваш несовершеннолетний ребенок</option></select></div><div class="select-label owner-label">Владелец недвижимости</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Предыдущие вычеты за эту недвижимость</div><div class="description">В случае повторного предоставления декларации по данному имуществу (если вы уже начали пользоваться вычетом в предыдущих годах) внесите в эти поля суммы использованного за предыдущие периоды налоговых вычетов</div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field input-filled" type="number" name="prev_sum" value="0"><a class="input-help prev-sum-help"></a><div class="input-label">Сумма предыдущих вычетов</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field input-filled" type="number" name="prev_percent" value="0"><a class="input-help prev-percent-help"></a><div class="input-label">Сумма процентов</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field input-filled" type="number" name="prev_employer" value="0"><a class="input-help prev-employer-help"></a><div class="input-label">Сумма от работодателя</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field input-filled" type="number" name="prev_employer_percent" value="0"><a class="input-help prev-employer-percent-help"></a><div class="input-label">Сумма процентов от работодателя</div></div></div></div></div></form>`
        );
        break;
      case "sell_estate":
        $(".forms").append(
          `<form class="form" name="sell_estate" id="${formID}"><a class="remove-form"></a><div class="form-part"><div class="form-part-header"><a class="header">Продажа недвижимости<div class="toggle-conditions">показать условия</div></a><div class="conditions"><p>Недвижимость делится на две категории. 1 категория - дома, квартиры, комнаты, садовые домики, земельные участки и доли во всем этом. 2 категория - гаражи, сараи и прочее недвижимое имущество. Для категорий установлены разные сроки сладения. Если вы владели имуществом дольше установленного максимального срока, то декларация на продажу этого имущества не подается и налоги не платятся.</p><ul><li>Для 2 категории максимальный срок владения 5 лет</li><li>Если имущество 1 категории было куплено, то максимальный срок владения 5 лет</li><li>Если имущество 1 категории было унаследовано от близких родственников, приватизировано или являлось единственным жильем, то максимальный срок владения 3 года</li></ul></div></div><div class="row"><div class="col-xs-12"><div class="radio-block radio-vertical"><input type="radio" id="${formID}-house" name="type" value="house" checked><label for="${formID}-house">Дом, квартира, комната, садовый домик, земельный участок</label><input type="radio" id="${formID}-fraction" name="type" value="fraction"><label for="${formID}-fraction">Доля в доме, квартире, земельном участке</label><input type="radio" id="${formID}-garage" name="type" value="garage"><label for="${formID}-garage">Гараж, сарай и прочее недвижимое имущество</label></div></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="buy_price"><a class="input-help buy-estate-help"></a><div class="input-label">Стоимость покупки, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="sell_price"><div class="input-label">Стоимость продажи, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3 hidden"><div class="input-block"><input class="input-field" type="number" name="fraction_size"><div class="input-label">Размер доли, %</div></div></div><div class="col-xs-12 col-sm-6 col-md-3 hidden"><div class="input-block"><input class="input-field" type="number" name="mortgage"><a class="input-help mortgage-help"></a><div class="input-label">Сумма выплаченных процентов по ипотеке</div></div></div></div><div class="row contract-form hidden"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-multi_contract" name="contract" value="multi" checked=""><label for="${formID}-multi_contract">Эта доля продана отдельным контрактом</label><input type="radio" id="${formID}-single_contract" name="contract" value="single"><label for="${formID}-single_contract">Все доли проданы одним контрактом</label></div></div></div></div><div class="subform-part rosreestr"><div class="form-part-header"><div class="header">Информация из Росреестра</div><div class="description">Вам нужно указать кадастровый номер и кадастровую стоимость недвижимости. Заказать выписку или найти данные о недвижимости по ее адресу можно<a href="https://rosreestr.net/uznat-kadastrovuyu-stoimost-nedvijimosti" target="_blank"> здесь.</a></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="text" name="kadastr_number"><div class="input-label">Кадастровый номер</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="kadastr_price"><div class="input-label">Кадастровая стоимость, руб.</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Информация о покупателе</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-individual" name="face" value="individual" checked><label for="${formID}-individual">Физическое лицо</label><input type="radio" id="${formID}-entity" name="face" value="entity"><label for="${formID}-entity">Юридическое лицо</label></div></div></div><div class="row individual-form"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="individual_name" value=""><div class="input-label">ФИО покупателя</div></div></div></div><div class="row entity-form hidden"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="entity_name"><div class="input-label">Наименование юр. лица</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_oktmo"><div class="input-label">Код по ОКТМО</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_inn"><div class="input-label">ИНН</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_kpp"><div class="input-label">КПП</div></div></div></div></div></form>`
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
