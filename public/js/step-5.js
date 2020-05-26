$(document).ready(function () {

  $("form").each(function (index) {
    addTooltips($(this));
    addMasks($(this));
  });

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
    switchTypeForm(form, $(this).val());
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

  function switchTypeForm($form, state) {
    if (state === "fraction") {
      $form.find(`input[name="mortgage"]`).parent().parent().removeClass("hidden");
      $form.find(`input[name="fraction_size"]`).parent().parent().removeClass("hidden");
      $form.find(`.contract-form`).removeClass("hidden");
    } else if (state === "house") {
      $form.find(`input[name="mortgage"]`).parent().parent().removeClass("hidden");
      $form.find(`input[name="fraction_size"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
      $form.find(`input[name="contract"][value="multi"]`).prop("checked", true);
      $form.find(`.contract-form`).addClass("hidden");
    } else if (state === "garage") {
      $form.find(`input[name="mortgage"]`).val("").removeClass("input-filled").parent().parent().addClass("hidden");
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
          `<form class="form" name="sell_estate" id="${formID}"><a class="remove-form"></a><div class="form-part"><div class="form-part-header"><a class="header">Продажа недвижимости<div class="toggle-conditions">показать условия</div></a><ul class="conditions"><li>Вы владели этой недвижимостью менее 3 лет, в противном случае декларация не подается и налог не платится</li></ul></div><div class="row"><div class="col-xs-12"><div class="radio-block radio-vertical"><input type="radio" id="${formID}-house" name="type" value="house" checked><label for="${formID}-house">Дом, квартира, комната, садовый домик, земельный участок</label><input type="radio" id="${formID}-fraction" name="type" value="fraction"><label for="${formID}-fraction">Доля в доме, квартире, земельном участке</label><input type="radio" id="${formID}-garage" name="type" value="garage"><label for="${formID}-garage">Гараж, сарай и прочее недвижимое имущество</label></div></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="buy_price"><a class="input-help buy-estate-help"></a><div class="input-label">Стоимость покупки, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="sell_price"><div class="input-label">Стоимость продажи, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3 hidden"><div class="input-block"><input class="input-field" type="number" name="fraction_size"><div class="input-label">Размер доли, %</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="mortgage"><a class="input-help mortrage-help"></a><div class="input-label">Сумма выплаченных процентов по ипотеке</div></div></div></div><div class="row contract-form hidden"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-multi_contract" name="contract" value="multi" checked=""><label for="${formID}-multi_contract">Эта доля продана отдельным контрактом</label><input type="radio" id="${formID}-single_contract" name="contract" value="single"><label for="${formID}-single_contract">Все доли проданы одним контрактом</label></div></div></div></div><div class="subform-part rosreestr"><div class="form-part-header"><div class="header">Информация из Росреестра</div><div class="description">Вам нужно указать кадастровый номер и кадастровую стоимость недвижимости. Заказать выписку или найти данные о недвижимости по ее адресу можно<a href="https://rosreestr.net/uznat-kadastrovuyu-stoimost-nedvijimosti" target="_blank"> здесь.</a></div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="text" name="kadastr_number"><div class="input-label">Кадастровый номер</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="kadastr_price"><div class="input-label">Кадастровая стоимость, руб.</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Информация о покупателе</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-individual" name="face" value="individual" checked><label for="${formID}-individual">Физическое лицо</label><input type="radio" id="${formID}-entity" name="face" value="entity"><label for="${formID}-entity">Юридическое лицо</label></div></div></div><div class="row individual-form"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="individual_name" value=""><div class="input-label">ФИО покупателя</div></div></div></div><div class="row entity-form hidden"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="entity_name"><div class="input-label">Наименование юр. лица</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_oktmo"><div class="input-label">Код по ОКТМО</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_inn"><div class="input-label">ИНН</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_kpp"><div class="input-label">КПП</div></div></div></div></div></form>`
        );
        break;
      case "sell_transport":
        $(".forms").append(
          `<form class="form" name="sell_transport" id="${formID}"><a class="remove-form"></a><div class="form-part"><div class="form-part-header"><a class="header">Продажа транспорта<div class="toggle-conditions">показать условия</div></a><ul class="conditions"><li>Транспортное средство должно подлежать обязательной государственной регистрации</li><li>Вы владели этим траспортным средством менее 3 лет, в противном случае декларация не подается и налог не платится</li></ul></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="buy_price"><a class="input-help buy-transport-help"></a><div class="input-label">Стоимость покупки, руб.</div></div></div><div class="col-xs-12 col-sm-6 col-md-3"><div class="input-block"><input class="input-field" type="number" name="sell_price"><div class="input-label">Стоимость продажи, руб.</div></div></div></div></div><div class="subform-part"><div class="form-part-header"><div class="header">Покупатель</div></div><div class="row"><div class="col-xs-12"><div class="radio-block"><input type="radio" id="${formID}-individual" name="face" value="individual" checked><label for="${formID}-individual">Физическое лицо</label><input type="radio" id="${formID}-entity" name="face" value="entity"><label for="${formID}-entity">Юридическое лицо</label></div></div></div><div class="row individual-form"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="individual_name"><div class="input-label">ФИО покупателя</div></div></div></div><div class="row entity-form hidden"><div class="col-xs-12"><div class="input-block"><input class="input-field" type="text" name="entity_name"><div class="input-label">Наименование юр. лица</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_oktmo"><div class="input-label">Код по ОКТМО</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_inn"><div class="input-label">ИНН</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="input-block"><input class="input-field" type="number" name="entity_kpp"><div class="input-label">КПП</div></div></div></div></div></form>`
        );
        break;
    }
    addTooltips($(`form[id="${formID}"]`));
    addMasks($(`form[id="${formID}"]`));
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
