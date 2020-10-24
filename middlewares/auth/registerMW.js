module.exports = function register(objectrepository) {
  const { userModel } = objectrepository;

  return function registerMW(req, res, next) {
    if (req.body.role === 'person' || req.body.role === 'company') {
      userModel.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        balance: 0,
      }, (err) => {
        if (err) {
          req.session.sessionFlash = {
            type: 'danger',
            message: 'DB error.',
          };

          return next(err);
        }

        req.session.sessionFlash = {
          type: 'success',
          message: 'Successful registration. Now you can log in.',
        };

        return next();
      });
    } else {
      req.session.sessionFlash = {
        type: 'danger',
        message: 'Bad request.',
      };

      return next();
    }
    return next('error');
  };
};
