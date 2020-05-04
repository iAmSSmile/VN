$(document).ready(function () {

  setMask();

  //Добавление строки с доходом за месяц у работодателя
  $(document).on("click", ".add-income-button", function (event) {
    let nextVal = Number($(this).parent().find(`.line:last-child .month select`).val()) + 1;
    if (nextVal < 10) {
      nextVal = "0" + String(nextVal);
    } else if (nextVal > 12) {
      nextVal = "12";
    } else {
      nextVal = String(nextVal);
    }
    $(this).parent().find(`.lines`).append(`
      <div class="line">
        <div class="month">
          <select class="income-input" name="income[][month]">
            <option ${nextVal === "01" ? "selected" : ""}>01</option>
            <option ${nextVal === "02" ? "selected" : ""}>02</option>
            <option ${nextVal === "03" ? "selected" : ""}>03</option>
            <option ${nextVal === "04" ? "selected" : ""}>04</option>
            <option ${nextVal === "05" ? "selected" : ""}>05</option>
            <option ${nextVal === "06" ? "selected" : ""}>06</option>
            <option ${nextVal === "07" ? "selected" : ""}>07</option>
            <option ${nextVal === "08" ? "selected" : ""}>08</option>
            <option ${nextVal === "09" ? "selected" : ""}>09</option>
            <option ${nextVal === "10" ? "selected" : ""}>10</option>
            <option ${nextVal === "11" ? "selected" : ""}>11</option>
            <option ${nextVal === "12" ? "selected" : ""}>12</option>
          </select>
        </div>
        <div class="code">
          <input class="income-input" type="number" name="income[][code]">
        </div>
        <div class="amount">
          <input class="income-input" type="number" name="income[][amount]:number">
        </div>
        <a class="remove-line"></a>
      </div>`);
    setMask();
  });

  //Удаление строки с доходом за месяц у работодателя
  $(document).on("click", ".remove-line", function (event) {
    $(this).parent().remove();
  });

  //Удаление работодателя
  $(document).on("click", ".remove-form", function (event) {
    $(this).parent().remove();
    setEmployerNumbers();
  });

  //Добавление работодателя

  $(document).on("click", ".add-form-button", function (event) {
    if ($(`form`).length < 3) {
      $(`.forms`).append(`
        <form class="form" name="employer">
          <a class="remove-form"></a>
          <div class="form-part">
            <div class="form-part-header">
              <div class="header">Работодатель №1</div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-6 col-md-9">
                <div class="input-block">
                  <input class="input-field" type="text" name="name">
                  <div class="input-label">Налоговый агент</div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <div class="input-block">
                  <input class="input-field" type="text" name="phone">
                  <div class="input-label">Телефон</div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <div class="input-block">
                  <input class="input-field" type="number" name="oktmo">
                  <div class="input-label">Код по ОКТМО</div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <div class="input-block">
                  <input class="input-field" type="number" name="inn">
                  <div class="input-label">ИНН</div>
                </div>
              </div>
                <div class="col-xs-12 col-sm-6 col-md-3">
                  <div class="input-block">
                    <input class="input-field" type="number" name="kpp">
                    <div class="input-label">КПП</div>
                  </div>
                </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <div class="input-block">
                  <input class="input-field" type="number" name="tax">
                  <div class="input-label">Сумма налога удержанная</div>
                </div>
              </div>
            </div>
          </div>
          <div class="subform-part incomes-part">
            <div class="form-part-header">
              <div class="header">Доходы, облагаемые по ставке 13%</div>
            </div>
            <div class="incomes">
              <div class="legend">
                <div class="month">Месяц</div>
                <div class="code">Код дохода</div>
                <div class="amount">Сумма дохода</div>
              </div>
              <div class="lines">
                <div class="line">
                  <div class="month">
                    <select class="income-input" name="income[][month]">
                      <option value="01" selected>01</option>
                      <option value="02">02</option>
                      <option value="03">03</option>
                      <option value="04">04</option>
                      <option value="05">05</option>
                      <option value="06">06</option>
                      <option value="07">07</option>
                      <option value="08">08</option>
                      <option value="09">09</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>
                  </div>
                  <div class="code">
                    <input class="income-input" type="number" name="income[][code]">
                  </div>
                  <div class="amount">
                    <input class="income-input" type="number" name="income[][amount]:number">
                  </div>
                  <a class="remove-line"></a>
                </div>
              </div>
              <a class="add-income-button">Добавить строку</a>
            </div>
          </div>
        </form>`);
      setEmployerNumbers();
    }
  });

  function setEmployerNumbers() {
    $(`form`).each(function (index) {
      $(this).find(`.header`).first().text(`Работодатель №${index + 1}`);
    });
    if ($(`form`).length === 3) {
      $(`.add-form-button`).addClass('add-form-button--disabled');
    } else {
      $(`.add-form-button`).removeClass('add-form-button--disabled');
    }
    setMask();
  }

  function setMask() {
    $(`input[name="oktmo"]`).mask("00000000000");
    $(`input[name="inn"]`).mask("000000000000");
    $(`input[name="kpp"]`).mask("000000000");
    $(`input[name*="code"]`).mask("0000");
  }

  check_fullness();

  $(document).on("keyup", "input", function () {
    check_fullness();
  });

  function check_fullness() {
    let empty = $("input:not(:radio)").filter(function (index) {
      return !$(this).val();
    });
    if (($(empty).length === 0) && $(`form`).length) {
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
    let formObject = {};
    let employers = [];
    $(`form`).each(function (index) {
      employers.push($(this).serializeJSON({parseNumbers: false}));
    });
    formObject.employers = employers;
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
    for (const field in errors) {
      let path = field.split('.');
      let formIndex = Number(path[1]);
      let fieldName = path[2];
      $(`<div class="input-error"> ${errors[field]} </div>`).insertBefore($(`form:eq(${formIndex}) input[name="${fieldName}"]`));
    }
    let dest = $(`.input-error:eq(0)`).offset().top - 180;
    $('html, body').animate({ scrollTop: dest }, 600);
    toastr.warning('Исправьте ошибки в заполненных полях, чтобы перейти к другому шагу.');
  }

});
