const mongoose = require('mongoose');
require('dotenv').config();

module.exports = function resetPasswordWithToken(objectrepository) {
  const { userModel } = objectrepository;
  const { resetModel } = objectrepository;

  return function resetPasswordWithTokenMW(req, res, next) {
    const pass1 = req.body.pass1 ? req.body.pass1 : null;
    const pass2 = req.body.pass2 ? req.body.pass2 : null;
    let pass = null;
    const token = String(req.params.token);

    if (!mongoose.Types.ObjectId.isValid(token)) {
      req.session.sessionFlash = {
        type: 'danger',
        message: 'Invalid token.',
      };

      return next();
    }

    if (pass1 && pass2) {
      if (pass1 === pass2) {
        pass = String(pass1);
      } else {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'Passwords do not match.',
        };

        return next();
      }
    } else {
      if (pass1) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'Passwords do not match.',
        };
      }
      if (pass2) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'Passwords do not match.',
        };
      }
    }

    resetModel.findOne({ _id: token }, async (err, reset) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(err);
      }

      if (reset && reset.valid) {
        if (pass) {
          try {
            await userModel.findOneAndUpdate({ _id: reset._user }, {
              password: pass,
            }, {
              useFindAndModify: false,
              runValidators: true,
            });

            await resetModel.findOneAndUpdate({ _id: token }, {
              valid: false,
            }, {
              useFindAndModify: false,
              runValidators: true,
            });
          } catch (e) {
            console.error(e);
            req.session.sessionFlash = {
              type: 'danger',
              message: 'Server error.',
            };

            return next(e);
          }

          req.session.sessionFlash = {
            type: 'success',
            message: 'New password has been set successfully.',
          };

          return next();
        }

        req.session.sessionFlash = {
          type: 'danger',
          message: 'Invalid password. Try again with the given link.',
        };

        return next();
      }

      req.session.sessionFlash = {
        type: 'danger',
        message: 'Invalid token.',
      };

      return next();
    });
    return next('error');
  };
};
