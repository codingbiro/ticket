// Betolti az adott profil adatait a db-bol, kilistazza az adatait

module.exports = function redirect(target) {
  return function redirectMW(req, res) {
    return res.redirect(`/${target}`);
  };
};
