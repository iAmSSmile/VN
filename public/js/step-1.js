$(document).ready(function () {
  new jBox('Tooltip', {
    attach: 'input[name="ifns"] + .input-help',
    target: `input[name="ifns"]`,
    theme: 'TooltipBorder',
    trigger: 'click',
    responsiveWidth: true,
    maxWidth: 500,
    adjustTracker: true,
    closeOnClick: 'body',
    closeOnEsc: true,
    animation: 'move',
    position: {
      x: 'right',
      y: 'bottom'
    },
    outside: 'y',
    pointer: 'right:20',
    content: `Код ИФНС подставляется автоматически, если при вводе адреса вы воспользовались подсказкой.<br><br> Если код ИФНС не определился, то вы можете найти его <a href="https://service.nalog.ru/addrno.do" target="_blank">вручную</a>`
  });


  $('input[name="name"]').suggestions({
    token: "68a711e0219be1cfa1d4b1f58ff4491efaa81455",
    type: "NAME",
    scrollOnFocus: false,
    mobileWidth: 768
  });

  $('input[name="address"]').suggestions({
    token: "68a711e0219be1cfa1d4b1f58ff4491efaa81455",
    type: "ADDRESS",
    scrollOnFocus: false,
    mobileWidth: 768,
    onSelect: function (suggestion) {
      if (suggestion.data.tax_office) {
        $('input[name="ifns"]').addClass("input-filled");
        $('input[name="ifns"]').val(suggestion.data.tax_office);
      }
    },
    onSelectNothing: function () {
      $('input[name="ifns"]').removeClass("input-filled");
      $('input[name="ifns"]').val("");
    }
  });

  $('input[name="birthplace"]').suggestions({
    token: "68a711e0219be1cfa1d4b1f58ff4491efaa81455",
    type: "ADDRESS",
    scrollOnFocus: false,
    mobileWidth: 768,
    onSuggestionsFetch: function (suggestions) {
      return suggestions.filter(function (suggestion) {
        return suggestion.data.fias_level === "4" || suggestion.data.fias_level === "6";
      });
    },
    onSelect: function (suggestion) {
    }
  });

  $('input[name="bank_name"]').suggestions({
    token: "68a711e0219be1cfa1d4b1f58ff4491efaa81455",
    type: "BANK",
    scrollOnFocus: false,
    mobileWidth: 768,
    onSelect: function (suggestion) {
      if (suggestion.data.bic) {
        $('input[name="bank_bik"]').val(suggestion.data.bic);
        $('input[name="bank_bik"]').addClass("input-filled");
      }
      if (suggestion.data.correspondent_account) {
        $('input[name="bank_correspondent_account"]').val(suggestion.data.correspondent_account);
        $('input[name="bank_correspondent_account"]').addClass("input-filled");
      }
    }
  });

  check_fullness();

  $(document).on("keyup", "input", function () {
    check_fullness();
  });

  function check_fullness() {
    let empty = $("input:not(:radio)").filter(function (index) {
      return !$(this).val();
    });
    if ($(empty).length === 0) {
      $(".step-footer").addClass("step-footer--filled");
    } else {
      $(".step-footer").removeClass("step-footer--filled");
    }
  }

  $('input[name="ifns"]').mask("0000");
  $('input[name*="inn"]').mask("000000000000");
  $('input[name*="passport_seria"]').mask("0000");
  $('input[name*="passport_number"]').mask("000000");
  $('input[name*="bank_inn"]').mask("0000000000");
  $('input[name*="bank_bik"]').mask("000000000");
  $('input[name*="bank_kpp"]').mask("000000000");
  $('input[name*="bank_correspondent_account"]').mask("00000000000000000000");
  $('input[name*="bank_personal_account"]').mask("00000000000000000000");


  //Отправка формы на сервер
  $(".forward").click(function () {
    postFormAndRedirect($(this).attr("data-redirect"));
  });

  $(".backward").click(function () {
    postFormAndRedirect($(this).attr("data-redirect"));
  });

  function postFormAndRedirect(url) {
    let formObject = $('form').serializeJSON({parseNumbers: false});

    $.ajax({
      type: "POST",
      url: "#",
      data: formObject,
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
      $(`<div class="input-error"> ${errors[field]} </div>`).insertBefore($(`input[name="${field}"]`));
    }
    let dest = $(`.input-error:eq(0)`).offset().top - 180;
    $('html, body').animate({ scrollTop: dest }, 600);

    toastr.warning('Исправьте ошибки в заполненных полях, чтобы перейти к другому шагу.', '', {
      preventDuplicates: true
    });

  }

});

