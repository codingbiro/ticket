/* eslint-disable no-await-in-loop */
module.exports = function addTickets(objectrepository) {
  const { ticketCategoryModel, ticketModel } = objectrepository;

  return function addTicketsMW(req, res, next) {
    const { ticketCategoryId } = req.params;
    // TODO check if event exists

    ticketCategoryModel.findOne({ _id: ticketCategoryId }, async (err, ticketCategory) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(err);
      }

      if (!ticketCategory || ticketCategory.actiaved) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'No ticketCategory found.',
        };

        return res.redirect('/');
      }

      const { quantity } = ticketCategory;
      const tickets = [];
      for (let i = 0; i < quantity; i += 1) {
        const newTicket = {
          code: 'default',
          _ticketCategory: ticketCategoryId,
        };
        const t = await ticketModel.create(newTicket);
        tickets.push(t._id);
      }

      try {
        await ticketCategoryModel.findOneAndUpdate({ _id: ticketCategoryId }, {
          _ticket: tickets,
        }, {
          useFindAndModify: false,
          runValidators: true,
        });
      } catch (e) {
        console.error(e);
        req.session.sessionFlash = {
          type: 'danger',
          message: 'Server error.',
        };

        return next(e);
      }

      req.session.sessionFlash = {
        type: 'success',
        message: 'Category activated.',
      };

      return next();
    });
  };
};
