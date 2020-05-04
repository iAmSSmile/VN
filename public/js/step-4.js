$(document).ready(function () {

  $('.forms form').each(function() {
    addTooltip($(this).attr('name'), $(this).attr('id'));
  });

  $(document).on("click", "a.header", function (event) {
    $(this).toggleClass("conditions-open");
    if ($(this).hasClass("conditions-open")) {
      $(this).find('.toggle-conditions').text('скрыть условия');
    } else {
      $(this).find('.toggle-conditions').text('показать условия');
    }
  });

  $(document).on("click", `input[name="expensive"] + .input-help`, function (event) {
    vex.dialog.alert({
      unsafeMessage:
        `<h3>Список дорогостоящих видов лечения</h3>
        <ul>
          <li>Хирургическое лечение врожденных аномалий (пороков развития).</li>
          <li>Хирургическое лечение тяжелых форм болезней системы кровообращения, включая операции с использованием аппаратов искусственного кровообращения, лазерных технологий и коронарной ангиографии.</li>
          <li>Хирургическое лечение тяжелых форм болезней органов дыхания.</li>
          <li>Хирургическое лечение тяжелых форм болезней и сочетанной патологии глаза и его придаточного аппарата, в том числе с использованием эндолазерных технологий.</li>
          <li>Хирургическое лечение тяжелых форм болезней нервной системы, включая микронейрохирургические и эндовазальные вмешательства.</li>
          <li>Хирургическое лечение осложненных форм болезней органов пищеварения.</li>
          <li>Эндопротезирование и реконструктивно-восстановительные операции на суставах.</li>
          <li>Трансплантация органов (комплекса органов), тканей и костного мозга.</li>
          <li>Реплантация, имплантация протезов, металлических конструкций, электрокардиостимуляторов и электродов.</li>
          <li>Реконструктивные, пластические и реконструктивно-пластические операции.</li>
          <li>Терапевтическое лечение хромосомных нарушений и наследственных болезней.</li>
          <li>Терапевтическое лечение злокачественных новообразований щитовидной железы и других эндокринных желез, в том числе с использованием протонной терапии.</li>
          <li>Терапевтическое лечение острых воспалительных полиневропатий и осложнений миастении.</li>
          <li>Терапевтическое лечение системных поражений соединительной ткани.</li>
          <li>Терапевтическое лечение тяжелых форм болезней органов кровообращения, дыхания и пищеварения у детей.</li>
          <li>Комбинированное лечение болезней поджелудочной железы.</li>
          <li>Комбинированное лечение злокачественных новообразований.</li>
          <li>Комбинированное лечение наследственных нарушений свертываемости крови и апластических анемий.</li>
          <li>Комбинированное лечение остеомиелита.</li>
          <li>Комбинированное лечение состояний, связанных с осложненным течением беременности, родов и послеродового периода.</li>
          <li>Комбинированное лечение осложненных форм сахарного диабета.</li>
          <li>Комбинированное лечение наследственных болезней.</li>
          <li>Комбинированное лечение тяжелых форм болезней и сочетанной патологии глаза и его придаточного аппарата.</li>
          <li>Комплексное лечение ожогов с площадью поражения поверхности тела 30 процентов и более.</li>
          <li>Виды лечения, связанные с использованием гемо- и перитонеального диализа.</li>
          <li>Выхаживание недоношенных детей массой до 1,5 кг.</li>
          <li>Лечение бесплодия методом экстракорпорального оплодотворения, культивирования и внутриматочного введения эмбриона.</li>
        </ul>`,
      buttons: [],
      showCloseButton: true,
      className: 'vex-theme-wireframe'
    })
  });

  $(document).on("click", ".remove-form", function (event) {
    $(this).parent().remove();
  });

  $(".add-form-button, .add-form .background").click(function () {
    if ($(".add-form-menu").css("display") === "block") {
      $(".add-form-menu, .add-form .background").css("display", "none");
      $(".menu-link").removeClass("selected");
      $(".submenu").css("display", "none");
    } else {
      $(".add-form-menu, .add-form .background").css("display", "block");
    }
  });

  $(".menu-link").click(function () {
    $(".submenu").css("display", "none");
    $("." + $(this).attr("data-submenu")).css("display", "flex");
    $(".menu-link").removeClass("selected");
    $(this).addClass("selected");
  });

  $(".submenu-link").click(function () {
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
    $(".menu-link").removeClass("selected");
    $(".submenu").css("display", "none");
    let formID = `${formName}--${getNewFormIndex(formName)}`;

    switch (formName) {
      case "teach_me":
        $(".forms").append(
          `<form class="form" name="teach_me" id="${formID}">
            <a class="remove-form"></a>
            <div class="documents"></div>
            <div class="form-part">
              <div class="form-part-header">
                <a class="header">Затраты на собственное обучение<div class="toggle-conditions">показать условия</div></a>
                <ul class="conditions">
                  <li> У учебного заведения должна быть лицензия на осуществление образовательной деятельности</li>
                  <li> Деньги можно вернуть за очную, заочную, вечернюю или любую другую форму обучения</li>
                </ul>
              <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="amount">
                    <div class="input-label">Сумма, руб.</div></div></div></div></div></form>`
        );
        break;
      case "teach_child":
        $(".forms").append(
          `<form class="form" name="teach_child" id="${formID}">
            <a class="remove-form"></a>
            <div class="documents"></div>
            <div class="form-part">
              <div class="form-part-header">
                <a class="header">Затраты на обучение ребенка, возрастом до 24 лет<div class="toggle-conditions">показать условия</div></a>
                <ul class="conditions">
                  <li> У учебного заведения должна быть лицензия на осуществление образовательной деятельности</li>
                  <li> Ребенок должен быть на очной форме обучения (детский сад, школа, очная форма вуза и т.п.)</li>
                  <li> Договор заключен на ваше имя или на имя вашего супруга/супруги</li>
                  <li> За учебу платите именно вы и это подтверждено платежными документами. Если в платежных документах стоит не ваше имя, от вас должна быть доверенность на передачу денег</li>
                  <li> Оплата за обучение не должна быть произведена за счет материнского капитала</li>
                </ul>
              </div>
              <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="amount">
                    <div class="input-label">Сумма, руб.</div></div></div></div></div></form>`
        );
        break;
      case "teach_brother":
        $(".forms").append(
          `<form class="form" name="teach_brother" id="${formID}">
            <a class="remove-form"></a>
            <div class="documents"></div>
            <div class="form-part">
              <div class="form-part-header">
                <a class="header">Затраты на обучение брата или сестры, возрастом до 24 лет<div class="toggle-conditions">показать условия</div></a>
                <ul class="conditions">
                  <li> У учебного заведения должна быть лицензия на осуществление образовательной деятельности</li>
                  <li> Брат или сестра должен быть на очной форме обучения (детский сад, школа, очная форма вуза и т.п.)</li>
                  <li> Договор заключен на ваше имя или на имя вашего супруга/супруги</li>
                  <li> За учебу платите именно вы и это подтверждено платежными документами. Если в платежных документах стоит не ваше имя, от вас должна быть доверенность на передачу денег</li>
                </ul>
              </div>
              <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="amount">
                    <div class="input-label">Сумма, руб.</div></div></div></div></div></form>`
        );
        break;
      case "heal_me":
        $(".forms").append(
          `<form class="form" name="heal_me" id="${formID}">
            <a class="remove-form"></a>
            <div class="documents"></div>
            <div class="form-part">
              <div class="form-part-header">
                <a class="header">Затраты на собственное лечение<div class="toggle-conditions">показать условия</div></a>
                <ul class="conditions">
                  <li> Лечебное учреждение должно быть зарегистрировано на территории России и быть лицензированным</li>
                </ul>
              </div>
              <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="amount">
                    <div class="input-label">Сумма, руб.</div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="expensive">
                    <a class="input-help"></a>
                    <div class="input-label">Дорогостоящие виды лечения, руб.</div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="medications">
                    <div class="input-label">Лекарственные препараты, руб.</div></div></div></div></div></form>`
        );
        break;
      case "heal_child":
        $(".forms").append(
          `<form class="form" name="heal_child" id="${formID}">
            <a class="remove-form"></a>
            <div class="documents"></div>
            <div class="form-part">
              <div class="form-part-header">
                <a class="header">Затраты на лечение ребенка, возрастом до 18 лет<div class="toggle-conditions">показать условия</div></a>
                <ul class="conditions">
                  <li> Лечебное учреждение должно быть зарегистрировано на территории России и быть лицензированным</li>
                </ul>
              </div>
              <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="amount">
                    <div class="input-label">Сумма, руб.</div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="expensive">
                    <a class="input-help"></a>
                    <div class="input-label">Дорогостоящие виды лечения, руб.</div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="medications">
                    <div class="input-label">Лекарственные препараты, руб.</div></div></div></div></div></form>`
        );
        break;
      case "heal_parent":
        $(".forms").append(
          `<form class="form" name="heal_parent" id="${formID}">
            <a class="remove-form"></a>
            <div class="documents"></div>
            <div class="form-part">
              <div class="form-part-header">
                <a class="header">Затраты на лечение родителя или супруга<div class="toggle-conditions">показать условия</div></a>
                <ul class="conditions">
                  <li> Лечебное учреждение должно быть зарегистрировано на территории России и быть лицензированным</li>
                </ul>
              </div>
              <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="amount">
                    <div class="input-label">Сумма, руб.</div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="expensive">
                    <a class="input-help"></a>
                    <div class="input-label">Дорогостоящие виды лечения, руб.</div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <div class="input-block">
                    <input class="input-field" type="number" name="medications">
                    <div class="input-label">Лекарственные препараты, руб.</div></div></div></div></div></form>`
        );
        break;
    }

    addTooltip(formName, formID);
  }

  function addTooltip(formName, formID) {
    let options = {
      attach: `#${formID} .documents`,
      target: `#${formID} .documents`,
      theme: 'TooltipBorder',
      trigger: 'click',
      responsiveWidth: true,
      maxWidth: 700,
      adjustTracker: true,
      closeOnClick: 'body',
      closeOnEsc: true,
      animation: 'move',
      outside: 'y',
      pointer: 'right:5',
    };

    switch (formName) {
      case "teach_me":
        options.content = `
          <b>Необходимые документы:</b><br>
          <ul>
            <li>Копия вашего паспорта</li>
            <li>Копия заключенного договора на обучение</li>
            <li>Копия лицензии учебного заведения (если реквизиты лицензии не указаны в договоре)</li>
            <li>Документы, подтверждающие факт оплаты обучения (платежные поручения, банковские выписки о безналичном перечислении денег, квитанции или кассовые чеки)</li>
          </ul>`;
        break;
      case "teach_child":
        options.content = `
          <b>Необходимые документы:</b><br>
          <ul>
            <li>Копия вашего паспорта</li>
            <li>Копия свидетельства о рождении ребенка</li>
            <li>Копия заключенного договора на обучение</li>
            <li>Копия лицензии учебного заведения (если реквизиты лицензии не указаны в договоре)</li>
            <li>Оригинал справки из образовательного учреждения, подтверждающий обучение ребенка по очной форме (если в договоре отсутствует указание на форму обучения)</li>
            <li>Документы, подтверждающие факт оплаты обучения (платежные поручения, банковские выписки о безналичном перечислении денег, квитанции или кассовые чеки)</li>
          </ul>`;
        break;
      case "teach_brother":
        options.content = `
          <b>Необходимые документы:</b><br>
          <ul>
            <li>Копия вашего паспорта</li>
            <li>Заверенная копия вашего свидетельство о рождении</li>
            <li>Заверенная копия свидетельства о рождении брата/сестры</li>
            <li>Копия заключенного договора на обучение</li>
            <li>Копия лицензии учебного заведения (если реквизиты учреждения не указаны в договоре)</li>
            <li>Оригинал справки из учебного учреждения, подтверждающий обучение брата/сестры по очной форме (если в договоре отсутствует указание на форму обучения)</li>
            <li>Документы, подтверждающие факт оплаты обучения (платежные поручения, банковские выписки о безналичном перечислении денег, квитанции или кассовые чеки)</li>
          </ul>`;
        break;
      case "heal_me":
        options.content = `
          <b>Необходимые документы:</b><br>
          <ul>
            <li>Копия вашего паспорта</li>
            <li>Копия договора с клиникой на оказание медицинских услуг. Лечение можно подтвердить другими документами: выпиской из медкарты, выписным эпикризом. Эти документы должен заверить ваш лечащий врач.</li>
            <li>Копия лицензии лечебного учреждения (если реквизиты лицензии не указаны в договоре)</li>
            <li>Оригинал справки об оплате медицинских услуг. В ней дорогостоящие медицинские услуги указываются под кодом 2, недорогостоящие — под кодом 1</li>
            <li>Рецептурный бланк на лекарственные препараты (если покупались)</li>
            <li>Документы, подтверждающие факт оплаты лечения, покупки лекарств или выплаты страховых взносов (платежные поручения, банковские выписки о безналичном перечислении денег, квитанции или кассовые чеки)</li>
          </ul>`;
        break;
      case "heal_child":
        options.content = `
          <b>Необходимые документы:</b><br>
          <ul>
            <li>Копия вашего паспорта</li>
            <li>Копия свидетельства о рождении ребенка</li>
            <li>Копия договора с клиникой на оказание медицинских услуг. Лечение можно подтвердить другими документами: выпиской из медкарты, выписным эпикризом. Эти документы должен заверить ваш лечащий врач.</li>
            <li>Копия лицензии лечебного учреждения (если реквизиты лицензии не указаны в договоре)</li>
            <li>Оригинал справки об оплате медицинских услуг. В ней дорогостоящие медицинские услуги указываются под кодом 2, недорогостоящие — под кодом 1</li>
            <li>Рецептурный бланк на лекарственные препараты (если покупались)</li>
            <li>Документы, подтверждающие факт оплаты лечения, покупки лекарств или выплаты страховых взносов (платежные поручения, банковские выписки о безналичном перечислении денег, квитанции или кассовые чеки)</li>
          </ul>`;
        break;
      case "heal_parent":
        options.content = `
          <b>Необходимые документы:</b><br>
          <ul>
            <li>Копия вашего паспорта</li>
            <li>Копия вашего свидетельства о рождении (при получении вычета на лечение родителя)</li>
            <li>Копия свидетельства о заключении брака (при получении вычета на лечение супруга/супруги)</li>
            <li>Копия договора с клиникой на оказание медицинских услуг. Лечение можно подтвердить другими документами: выпиской из медкарты, выписным эпикризом. Эти документы должен заверить ваш лечащий врач.</li>
            <li>Копия лицензии лечебного учреждения (если реквизиты лицензии не указаны в договоре)</li>
            <li>Оригинал справки об оплате медицинских услуг. В ней дорогостоящие медицинские услуги указываются под кодом 2, недорогостоящие — под кодом 1</li>
            <li>Рецептурный бланк на лекарственные препараты</li>
            <li>Документы, подтверждающие факт оплаты лечения, покупки лекарств или выплаты страховых взносов (платежные поручения, банковские выписки о безналичном перечислении денег, квитанции или кассовые чеки)</li>
          </ul>`;
        break;
    }
    new jBox('Tooltip', options);
  }

  check_fullness();

  $(document).on("click", "a", function () {
    check_fullness();
  });

  $(document).on("keyup", "input", function () {
    check_fullness();
  });

  function check_fullness() {
    let empty = $(`input[name="amount"]`).filter(function (index) {
      return !$(this).val();
    });
    if ($(empty).length === 0 && $(`form`).length > 0) {
      $(".step-footer").addClass("step-footer--filled");
    } else {
      $(".step-footer").removeClass("step-footer--filled");
    }
  }

  $(".forward").click(function () {
    postFormAndRedirect($(this).attr("data-redirect"));
  });

  $(".backward").click(function () {
    postFormAndRedirect($(this).attr("data-redirect"));
  });

  function postFormAndRedirect(url) {
    let formObject = {
      teach_me: [],
      teach_child: [],
      teach_brother: [],
      heal_me: [],
      heal_child: [],
      heal_parent: []
    };
    $(`form[name="teach_me"]`).each(function (index) {
      formObject.teach_me.push($(this).serializeJSON());
    });
    $(`form[name="teach_child"]`).each(function (index) {
      formObject.teach_child.push($(this).serializeJSON());
    });
    $(`form[name="teach_brother"]`).each(function (index) {
      formObject.teach_brother.push($(this).serializeJSON());
    });
    $(`form[name="heal_me"]`).each(function (index) {
      formObject.heal_me.push($(this).serializeJSON());
    });
    $(`form[name="heal_child"]`).each(function (index) {
      formObject.heal_child.push($(this).serializeJSON());
    });
    $(`form[name="heal_parent"]`).each(function (index) {
      formObject.heal_parent.push($(this).serializeJSON());
    });
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
});