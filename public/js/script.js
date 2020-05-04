$(document).ready(function () {

  toastr.options.positionClass = "toast-bottom-full-width";

  $(".declarations .edit, .declarations .buy").each(function () {
    let newFormat = Object.assign(luxon.DateTime.DATETIME_MED, {month: 'long'});
    $(this).text(luxon.DateTime.fromISO($(this).text()).toLocaleString(newFormat));
  });

  $(".datedropper").flatpickr({
    "locale": "ru",
    dateFormat: "d.m.Y",
    allowInput: true,
    disableMobile: true
  });

  $(".legal, #step-2-employer").Chocolat({});

  $(".declaration .delete").on("click", function (event) {
    let declaration = $(this).attr("data-declaration");
    vex.dialog.buttons.YES.text = 'Да';
    vex.dialog.buttons.NO.text = 'Нет';
    vex.dialog.confirm({
      message: 'Вы действительно хотите удалить декларацию?',
      className: 'vex-theme-wireframe',
      callback: function (value) {
        if (value) {
          window.location.href = '/declaration/' + declaration + '/delete';
        }
      }
    })
  });

  $(document).on("focus", ".input-field", function (event) {
    $(this).addClass("input-filled");
  });

  $(document).on("blur", ".input-field", function (event) {
    if ($(this).val() === "") {
      $(this).removeClass("input-filled");
    }
  });

  $(document).on("change", ".input-field", function (event) {
    if ($(this).val() === "") {
      $(this).removeClass("input-filled");
    }
  });

  $(document).on("keyup", ".input-field", function (event) {
    if ($(this).siblings('.input-error').length) {
      $(this).siblings('.input-error').remove();
    }
  });

  $(".cookie-agree-button").click(function () {
    $.ajax({
      type: "POST",
      url: "/cookie_agree",
      data: "",
      success: function (data) {
        $(".cookie-agree").css("display", "none");
      }
    });
  });

  $(".user-menu .username").click(function (event) {
    $(".user-menu").toggleClass("user-menu--opened");
    event.stopPropagation();
  });

  $(document).click(function (event) {
    $(".user-menu").removeClass("user-menu--opened");
  });

  $(".burger-button").click(function (event) {
    $(".burger").toggleClass("burger--opened");
  });
});
