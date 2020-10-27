module.exports = function thanks(objectrepository) {
  const { orderModel } = objectrepository;

  return function thanksMW(req, res, next) {
    const { paymentId } = req.params;
    console.log(paymentId);
    console.log(orderModel);
    orderModel.find({ pid: paymentId }, (err, order) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      console.log(order);
      console.log(order[0]);
      [res.locals.order] = order;
      console.log(res.locals.order);

      return next();
    });
  };
};
