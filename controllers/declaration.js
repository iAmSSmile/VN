const Declaration = require('../models/declaration');

exports.get_declarations = function (req, res, next) {
  Declaration.find({'user': req.user._id}, null, {sort: {last_edit: 1}}, (err, declarations) => {
    res.render('declaration/declarations', {
      user: req.user,
      declarations: declarations,
      declOfNum: function declOfNum(n, titles) {
        return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
      }
    });
  });
};

exports.new_declaration = function (req, res, next) {
  Declaration.create({'user': req.user._id}, (err, declaration) => {
    res.redirect('/declaration/' + declaration._id + '/step/1');
  });
};

exports.delete_declaration = function (req, res, next) {
  Declaration.deleteOne({'_id': req.params.declarationId}, function (err) {
    if (err) console.log(err);
    res.redirect('/declarations');
  });
};


exports.get_step = function (req, res, next) {
  Declaration.findOne({'_id': req.params.declarationId}, (err, declaration) => {
    res.render('declaration/step_' + req.params.step, {
      user: req.user,
      declaration: declaration
    });
  });
};

exports.post_step_1 = (req, res, next) => {
  Declaration.findOne({'_id': req.params.declarationId}, (err, declaration) => {
    declaration.year = req.body.year;
    declaration.name = req.body.name;
    declaration.phone = req.body.phone;
    declaration.birthdate = req.body.birthdate;
    declaration.birthplace = req.body.birthplace;
    declaration.inn = req.body.inn;
    declaration.passport_seria = req.body.passport_seria;
    declaration.passport_number = req.body.passport_number;
    declaration.passport_issue_date = req.body.passport_issue_date;
    declaration.passport_issue_place = req.body.passport_issue_place;
    declaration.address = req.body.address;
    declaration.ifns = req.body.ifns;
    declaration.category = "760";
    declaration.bank_name = req.body.bank_name;
    declaration.bank_inn = req.body.bank_inn;
    declaration.bank_bik = req.body.bank_bik;
    declaration.bank_kpp = req.body.bank_kpp;
    declaration.bank_correspondent_account = req.body.bank_correspondent_account;
    declaration.bank_personal_account = req.body.bank_personal_account;
    declaration.last_edit = new Date();

    declaration.save((err, doc) => {
      if (err) {
        res.json({"validation_errors": JSON.stringify(collectValidationErrors(err))});
      } else {
        res.json({"redirect": '/declaration/' + declaration._id + '/step/2'});
      }
    })
  })
};

exports.post_step_2 = (req, res, next) => {
  Declaration.findOne({'_id': req.params.declarationId}, (err, declaration) => {
    declaration.employers = [];
    declaration.employers = req.body.employers;
    declaration.employers.forEach((employer) => {
      employer.income.forEach((incomeLine) => {
        let month = Number(incomeLine.month)-1;
        if (!employer.month_income[month]) employer.month_income[month] = 0;
        employer.month_income[month] += incomeLine.amount;
      })
    });
    declaration.last_edit = new Date();

    declaration.save((err, doc) => {
      if (err) {
        console.log(err);
        res.json({"validation_errors": JSON.stringify(collectValidationErrors(err))});
      } else {
        res.json({"redirect": '/declaration/' + declaration._id + '/step/3'});
      }
    })
  });
};

exports.post_step_3 = (req, res, next) => {
  Declaration.findOne({'_id': req.params.declarationId}, (err, declaration) => {
    declaration.child_18 = req.body.child_18;
    declaration.child_24 = req.body.child_24;
    declaration.last_edit = new Date();
    declaration.save((err, doc) => {
      if (err) console.log(err);
      res.json({"redirect": '/declaration/' + declaration._id + '/step/4'});
    })
  });
};

exports.post_step_4 = (req, res, next) => {
  Declaration.findOne({'_id': req.params.declarationId}, (err, declaration) => {
    declaration.teach_me = req.body.teach_me;
    declaration.teach_child = req.body.teach_child;
    declaration.teach_brother = req.body.teach_brother;
    declaration.heal_me = req.body.heal_me;
    declaration.heal_child = req.body.heal_child;
    declaration.heal_parent = req.body.heal_parent;
    declaration.last_edit = new Date();
    declaration.save((err, doc) => {
      if (err) {
        console.log(err);
        res.json({"validation_errors": JSON.stringify(collectValidationErrors(err))});
      } else {
        res.json({"redirect": '/declaration/' + declaration._id + '/step/5'});
      }

      // if (declaration.FULLNESS.length) {
      //   res.json({"redirect": "/declarations"});
      // } else {
      //   res.json({"redirect": "/declaration/" + declaration._id + "/generate"});
      // }
    })
  });
};

exports.post_step_5 = (req, res, next) => {
  Declaration.findOne({'_id': req.params.declarationId}, (err, declaration) => {
    declaration.sell_estate = req.body.sell_estate;
    declaration.sell_transport = req.body.sell_transport;
    declaration.last_edit = new Date();
    declaration.save((err, doc) => {
      if (err) {
        console.log(err);
        res.json({"validation_errors": JSON.stringify(collectValidationErrors(err))});
      } else {
        res.json({"redirect": '/declaration/' + declaration._id + '/verify'});
      }
    })
  });
};


exports.verify_declaration = function (req, res, next) {
  Declaration.findOne({'_id': req.params.declarationId}, (err, declaration) => {
    res.render('declaration/verify_declaration', {
      user: req.user,
      declaration: declaration
    });
  });
};

function collectValidationErrors (err) {
  let errors = {};
  for (const field in err.errors) {
    errors[field] = err.errors[field].message;
  }
  return errors;
}