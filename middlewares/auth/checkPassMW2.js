module.exports = function checkPass2(objectrepository) {
  const { userModel } = objectrepository;

  return async function checkPassMW2(req, res) {
    const em = req.query.userAuthId;
    const pa = req.query.userAuthSecret;

    if (!em || !pa) {
      req.session.sessionFlash = {
        type: 'danger',
        message: 'Bad request.',
      };

      return res.redirect('/');
    }

    userModel.findOne({ email: em }, (err, user) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return res.redirect('/');
      }

      if (user && pa === user.password) {
        req.session.user = user;

        return req.session.save((errr) => {
          if (errr) {
            req.session.sessionFlash = {
              type: 'danger',
              message: 'Error in saving your session.',
            };

            return res.redirect('/');
          }

          return res.redirect('/dashboard');
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
