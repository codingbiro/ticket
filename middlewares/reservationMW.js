/* eslint-disable no-await-in-loop */
module.exports = function reservation(objectrepository) {
  const { reservationModel, ticketModel } = objectrepository;

  return function reservationMW(req, res, next) {
    const { ticketCategoryId } = req.params;
    const { quantity } = req.body;

    reservationModel.findOne({ _user: req.session.user._id, valid: true }, (errr, reserv) => {
      if (errr) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'DB error.',
        };

        return next(errr);
      }

      if (reserv) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'Cannot reserve multiple. Wait until we process your last payment.',
        };

        return next('Already reserved');
      }

      ticketModel.find({ _ticketCategory: ticketCategoryId, reserved: false, valid: true }, async (err, tickets) => {
        if (err) {
          req.session.sessionFlash = {
            type: 'danger',
            message: 'DB error.',
          };

          return next(err);
        }

        if (tickets.length < quantity) {
          req.session.sessionFlash = {
            type: 'danger',
            message: `Sorry, but we only have ${tickets.length} ticket(s) left.`,
          };

          return res.redirect('/events');
        }

        const ids = [];

        for (let i = 0; i < quantity; i += 1) {
          ids.push(tickets[i]._id);
        }

        try {
          await ticketModel.updateMany({ _id: { $in: ids } }, {
            reserved: true,
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

        const reserv = {
          _ticket: ids,
          _user: req.session.user._id,
        };
        await reservationModel.create(reserv);

        req.session.sessionFlash = {
          type: 'success',
          message: 'Tickets reserved.',
        };

        return next();
      });
    });
  };
};
