module.exports = function redirectToLastView() {
  return function redirectToLastViewMW(req, res) {
    let target = req.query.view || 'dashboard';
    if (target === 'undefined') target = 'dashboard';
    return res.redirect(`/${target}`);
  };
};
