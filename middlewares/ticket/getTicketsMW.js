module.exports = function getTickets(objectrepository) {
  const { ticketModel } = objectrepository;

  return function getTicketsMW(req, res, next) {
    ticketModel.find({ _user: req.session.user._id }, (err, tickets) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(err);
      }

      res.locals.tickets = tickets;

      return next();
    });
  };
};
