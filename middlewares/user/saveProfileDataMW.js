// TODO nem frissulnek az adatok mentes utan a screenen

module.exports = function saveProfileData(objectrepository) {
  const { userModel } = objectrepository;

  return async function saveProfileDataMW(req, res, next) {
    const address = req.body.address ? req.body.address : null;
    const name = req.body.name ? req.body.name : null;
    const company = req.body.company ? req.body.company : '';

    const setter = {
      address,
      name,
      company,
    };

    try {
      await userModel.findOneAndUpdate({ _id: req.session.user._id },
        setter, {
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
      message: 'Profile updating has been successful.',
    };

    return next();
  };
};
