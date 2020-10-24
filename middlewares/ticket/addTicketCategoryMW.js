module.exports = function addTicketCategory(objectrepository) {
  const { ticketCategoryModel } = objectrepository;

  return function addTicketCategoryMW(req, res, next) {
    const desc = req.body.desc ? req.body.desc : null;
    const title = req.body.title ? req.body.title : null;
    const price = req.body.price ? req.body.price : null;
    const event = String(req.params.eventId);
    const quantity = req.body.quantity ? req.body.quantity : 0;

    // TODO check if event exists

    ticketCategoryModel.create(
      {
        title,
        desc,
        price,
        quantity,
        _event: event,
      },
      (err) => {
        if (err) {
          req.session.sessionFlash = {
            type: 'danger',
            message: 'DB error.',
          };
          return next(err);
        }

        req.session.sessionFlash = {
          type: 'success',
          message: 'New ticketCategory has been added.',
        };

        return next();
      },
    );
  };
};
