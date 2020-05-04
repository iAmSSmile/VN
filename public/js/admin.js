$(document).ready(function () {
  $(".date").each(function () {
    let newFormat = Object.assign(luxon.DateTime.DATETIME_MED, { month: 'long' });
    $(this).text(luxon.DateTime.fromISO($(this).text()).toLocaleString(newFormat));
  });
});