module.exports = function getTicketCategory(objectrepository) {
  const { ticketCategoryModel } = objectrepository;

  return function getTicketCategoryMW(req, res, next) {
    ticketCategoryModel.findOne({ _id: req.params.ticketCategoryId }, (err, ticketCategory) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(err);
      }

      if (!ticketCategory) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'No ticketCategories were found.',
        };

        return res.redirect('/');
      }

      res.locals.ticketCategory = ticketCategory;

      return next();
    });
  };
};
