module.exports = function logout() {
  return function logoutMW(req, res, next) {
    req.session.user = null;

    return req.session.save((err) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(err);
      }

      req.session.sessionFlash = {
        type: 'success',
        message: 'Successful logout.',
      };

      return res.redirect('/');
    });
  };
};
