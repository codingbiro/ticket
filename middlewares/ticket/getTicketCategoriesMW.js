module.exports = function getTicketCategories(objectrepository) {
  const { ticketCategoryModel } = objectrepository;

  return function getTicketCategoriesMW(req, res, next) {
    ticketCategoryModel.find({ _event: req.params.eventId }, (err, ticketCategories) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(err);
      }

      if (!ticketCategories) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'No ticketCategories were found.',
        };

        return res.redirect('/');
      }

      res.locals.ticketCategories = ticketCategories;

      return next();
    });
  };
};
