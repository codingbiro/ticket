module.exports = function getTicket(objectrepository) {
  const { ticketModel } = objectrepository;

  return function getTicketMW(req, res, next) {
    ticketModel.findOne({ _id: req.body.id }, (err, ticket) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(err);
      }

      if (!ticket) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'No ticket found.',
        };

        return res.redirect('/');
      }

      res.locals.ticket = ticket;

      return next();
    });
  };
};
