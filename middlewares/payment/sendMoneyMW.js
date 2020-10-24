module.exports = function sendMoney(objectrepository) {
  const { userModel } = objectrepository;

  return async function sendMoneyMW(req, res, next) {
    if (!res.locals.recip) {
      return next();
    }

    if (res.locals.user.balance < req.body.amount) {
      req.session.sessionFlash = {
        type: 'danger',
        message: 'Insufficient balance.',
      };

      return next();
    }

    const newbalance1 = parseInt(res.locals.user.balance, 10) - parseInt(req.body.amount, 10);
    const user1 = res.locals.user._id;
    const newbalance2 = parseInt(res.locals.recip.balance, 10) + parseInt(req.body.amount, 10);
    const user2 = res.locals.recip._id;

    try {
      await userModel.findOneAndUpdate({ _id: user1 }, {
        balance: newbalance1,
      }, {
        useFindAndModify: false,
        runValidators: true,
      });

      await userModel.findOneAndUpdate({ _id: user2 }, {
        balance: newbalance2,
      }, {
        useFindAndModify: false,
        runValidators: true,
      });
    } catch (e) {
      console.error(`${e} ${user1} ${user2}`);
      req.session.sessionFlash = {
        type: 'danger',
        message: 'Server error.',
      };

      return next(e);
    }

    req.session.sessionFlash = {
      type: 'success',
      message: 'Money successfully transfered.',
    };

    return next();
  };
};
