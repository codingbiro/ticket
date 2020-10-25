module.exports = function auth(objectrepository, name) {
  const { userModel } = objectrepository;

  return function authMW(req, res, next) {
    const path = name || req.originalUrl.substring(1);
    if (!req.session.user) {
      req.session.sessionFlash = {
        type: 'danger',
        message: 'Log in to view content.',
      };

      return path ? res.redirect(`/?view=${path}`) : res.redirect('/');
    }

    userModel.findOne({ _id: req.session.user._id }, (err, user) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(err);
      }

      if (user) {
        res.locals.user = user;
        return next();
      }

      req.session.sessionFlash = {
        type: 'danger',
        message: 'Invalid session.',
      };

      return path ? res.redirect(`/?view=${path}`) : res.redirect('/');
    });

    return null;
  };
};
