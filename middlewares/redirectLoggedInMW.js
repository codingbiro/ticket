module.exports = function redirectLoggedIn() {
  return function redirectLoggedInMW(req, res, next) {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }

    return next();
  };
};
