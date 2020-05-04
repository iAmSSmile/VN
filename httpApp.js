const express = require('express');

var app = express();

app.get("*", function (req, res, next) {
  res.redirect("https://" + req.headers.host + "/" + req.path);
});

module.exports = app;