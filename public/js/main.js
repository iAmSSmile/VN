$(document).ready(function () {
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

  $(".cookie-agree-button").click(function () {
    $.ajax({
      type: "POST",
      url: "/cookie_agree",
      data: "",
      success: function (data) {
        $(".cookie-agree").css( "display", "none" );
      }
    });
  });

  $(".ask-question a").click(function () {
    $.ajax({
      type: "POST",
      url: "/send_mail",
      data: $(".ask-question form").serializeArray(),
      success: function (data) {
        console.log("sent");
      }
    });
  });

  $(document).on("focus", ".input-field", function (event) {
    $(this).addClass("input-filled");
  });

  $(document).on("blur", ".input-field", function (event) {
    console.log('asdf');
    if ($(this).val() === "") {
      $(this).removeClass("input-filled");
    }
  });

  $(document).on("keyup", ".input-field", function (event) {
    if ($(this).siblings('.input-error').length) {
      $(this).siblings('.input-error').remove();
    }
  });

  $('.subscribe .button').on("click", function (event) {
    if ($('.subscribe .input-field').val() !== "")  {
      $.ajax({
        type: "POST",
        url: "/subscribe",
        data: $('#subscribe').serialize(),
        success: function (data) {
          $('.subscribe .input-field').removeClass("input-filled").val('');
          vex.dialog.alert({
            message: data.message,
            className: 'vex-theme-wireframe'
          });
        }
      });
    }
  })
});
