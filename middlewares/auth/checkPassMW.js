module.exports = function checkPass(objectrepository) {
  const { userModel } = objectrepository;

  return async function checkPassMW(req, res, next) {
    if (typeof req.body.password === 'undefined' || typeof req.body.email === 'undefined') {
      req.session.sessionFlash = {
        type: 'danger',
        message: 'Bad request.',
      };

      return res.redirect('/');
    }

    userModel.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return res.redirect('/');
      }

      if (user && req.body.password === user.password) {
        req.session.user = user;

        return req.session.save((errr) => {
          if (errr) {
            req.session.sessionFlash = {
              type: 'danger',
              message: 'Error in saving your session.',
            };

            return res.redirect('/');
          }

          return next();
        });
      }

      req.session.sessionFlash = {
        type: 'danger',
        message: 'Wrong credentials!',
      };

      return res.redirect('/');
    });
    return null;
  };
};
