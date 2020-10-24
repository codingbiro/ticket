module.exports = function getOrders(objectrepository) {
  const { orderModel } = objectrepository;

  return function getOrdersMW(req, res, next) {
    orderModel.find({ _user: req.session.user._id }, (err, orders) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(err);
      }

      res.locals.orders = orders;

      return next();
    });
  };
};
