$(document).ready(function () {

  //Проверка на уникальность первого и второго ребенка по счету
  $(document).on("change", "select[name='child_count']", function (event) {
    if ($(event.target).val() !== "3") {
      $("select[name='child_count']").not(this).each(function (index) {
        if ($(this).val() === $(event.target).val()) {
          $(this).val("3");
        }
      })
    }
  });

  function childCountCheck () {
    let first = $(`form select[name="child_count"]`).toArray().some(item => $(item).val() === "1");
    let second = $(`form select[name="child_count"]`).toArray().some(item => $(item).val() === "2");
    if (first && second) {
      return "3"
    } else if (!first) {
      return "1"
    } else if (!second) {
      return "2"
    }
  }

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
    let formNameWithIndex = `${formName}--${getNewFormIndex(formName)}`;

    switch (formName) {
      case "child_18":
        $(".forms").append(
          `<form class="form" name="child_18" id="${formNameWithIndex}"><a class="remove-form"></a><div class="form-part"><div class="form-part-header"><div class="header">Ребенок, возрастом до 18 лет</div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-4"><div class="select-block"><select class="select-field" type="number" name="child_count"><option value="1" ${childCountCheck() === "1"?"selected":""}>первый</option><option value="2" ${childCountCheck() === "2"?"selected":""}>второй</option><option value="3" ${childCountCheck() === "3"?"selected":""}>третий или более</option></select><div class="select-label">Какой по счету ребенок?</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="checkbox-block"><input class="checkbox-field" type="checkbox" id="${formNameWithIndex}-invalid" name="invalid:boolean"><label class="checkbox-label" for="${formNameWithIndex}-invalid">ребенок-инвалид</label></div></div></div></div></form>`
        );
        break;
      case "child_24":
        $(".forms").append(
          `<form class="form" name="child_24" id="${formNameWithIndex}"><a class="remove-form"></a><div class="form-part"><div class="form-part-header"><div class="header">Ребенок, возрастом от 18 до 24 лет, учащийся на дневном отделении</div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-4"><div class="select-block"><select class="select-field" type="number" name="child_count"><option value="1" ${childCountCheck() === "1"?"selected":""}>первый</option><option value="2" ${childCountCheck() === "2"?"selected":""}>второй</option><option value="3" ${childCountCheck() === "3"?"selected":""}>третий или более</option></select><div class="select-label">Какой по счету ребенок?</div></div></div><div class="col-xs-12 col-sm-6 col-md-4"><div class="checkbox-block"><input class="checkbox-field" type="checkbox" id="${formNameWithIndex}-invalid" name="invalid:boolean"><label class="checkbox-label" for="${formNameWithIndex}-invalid">ребенок-инвалид</label></div></div></div></div></form>`
        );
        break;
    }
    check_fullness();
  }

  //Удаление ребенка
  $(document).on("click", ".remove-form", function (event) {
    $(this).parent().remove();
    check_fullness();
  });

  check_fullness();

  function check_fullness() {
    if ($(`form`).length > 0) {
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
      child_18: [],
      child_24: [],
    };
    $(`form[name="child_18"]`).each(function (index) {
      formObject.child_18.push($(this).serializeJSON());
    });
    $(`form[name="child_24"]`).each(function (index) {
      formObject.child_24.push($(this).serializeJSON());
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