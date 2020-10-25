module.exports = function register(objectrepository) {
  const { userModel } = objectrepository;

  return function registerMW(req, res, next) {
    userModel.create({
      name: req.body.name,
      email: req.body.email,
      company: req.body.company || '',
      address: req.body.address,
      password: req.body.password,
    }, (err) => {
      if (err) {
        console.log(err);
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
  };
};
