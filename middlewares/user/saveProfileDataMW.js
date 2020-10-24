// TODO nem frissulnek az adatok mentes utan a screenen

module.exports = function saveProfileData(objectrepository) {
  const { userModel } = objectrepository;

  return async function saveProfileDataMW(req, res, next) {
    const desc = req.body.desc ? req.body.desc : null;
    const name = req.body.name ? req.body.name : null;
    const pass1 = req.body.pass1 ? req.body.pass1 : null;
    const pass2 = req.body.pass2 ? req.body.pass2 : null;
    const img = req.file ? req.file : null;
    const imgPath = img ? img.path : null;
    const city = req.body.city ? req.body.city : null;
    const price = req.body.price ? req.body.price : null;

    let pass = null;

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

    let setter;
    if (imgPath != null) {
      setter = {
        desc,
        name,
        price: Number(price),
        city,
        img: imgPath,
      };
    } else {
      setter = {
        desc,
        name,
        price: Number(price),
        city,
      };
    }

    try {
      await userModel.findOneAndUpdate({ _id: req.session.user._id },
        setter, {
          useFindAndModify: false,
          runValidators: true,
        });

      if (pass) {
        await userModel.findOneAndUpdate({ _id: req.session.user._id }, {
          password: pass,
        }, {
          useFindAndModify: false,
          runValidators: true,
        });
      }
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
      message: 'Profile updating has been successful.',
    };

    return next();
  };
};
