module.exports = function canResetPass(objectrepository) {
  const { userModel } = objectrepository;

  return function canResetPassMW(req, res, next) {
    userModel.findOne({ email: req.body.resetemail }, (err, user) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(err);
      }
      if (user) {
        res.locals.rspwu = user;
        return next();
      }

      req.session.sessionFlash = {
        type: 'success',
        message: 'If the given email address exists in our system, an e-mail should be on its way with the further steps.',
      };

      return res.redirect('/');
    });
  };
};
