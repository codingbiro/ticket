module.exports = function getTickets(objectrepository) {
  const { userModel } = objectrepository;

  return function getTicketsMW(req, res, next) {
    userModel.findOne({ _id: req.session.user._id }, (err, user) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(err);
      }

      res.locals.tickets = user._ticket;

      return next();
    });
  };
};
