module.exports = function thanks(objectrepository) {
  const { orderModel } = objectrepository;

  return function thanksMW(req, res, next) {
    const { paymentId } = req.params;
    orderModel.findOne({ pid: paymentId }, (err, order) => {
      if (err) {
        return next(err);
      }

      res.locals.order = order;

      return next();
    });
  };
};
