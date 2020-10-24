module.exports = function adminOnly() {
  return function adminOnlyMW(req, res, next) {
    if (!req.session.user.isAdmin) {
      req.session.sessionFlash = {
        type: 'danger',
        message: 'You do not have permission to view this page.',
      };

      return res.redirect('/dashboard');
    }

    return next();
  };
};
