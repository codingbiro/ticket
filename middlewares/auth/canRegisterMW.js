module.exports = function canRegister(objectrepository) {
  const { userModel } = objectrepository;

  return function canRegisterMW(req, res, next) {
    if (req.body.password !== req.body.password2) {
      req.session.sessionFlash = {
        type: 'danger',
        message: 'Passwords do not match.',
      };

      return res.redirect('/register');
    }

    userModel.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
console.log(err);
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return res.redirect('/register');
      }

      if (user) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'E-mail is taken or invalid.',
        };

        return res.redirect('/register');
      }

      return next();
    });
    return null;
  };
};
