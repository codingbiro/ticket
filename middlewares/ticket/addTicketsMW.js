module.exports = function addTickets(objectrepository) {
  const { eventModel, ticketModel } = objectrepository;

  return function addTicketsMW(req, res, next) {
    const desc = req.body.desc ? req.body.desc : null;
    const title = req.body.title ? req.body.title : null;
    const price = req.body.price ? req.body.price : null;
    const event = req.body.event ? req.body.event : null;
    const user = req.body.user ? req.body.user : null;
    const quantity = req.body.quantity ? req.body.quantity : 0;

    // TODO check if event exists
    for (let i = 0; i < quantity; i = i + 1) {
      const newTicket = {
        desc,
        title,
        price,
        user,
        event,
        code: 'default'
      };  
      ticketModel.create(
        newTicket,
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
            message: 'New ticket(s) has been added.',
          };
  
          return next();
        },
      );
    }
  };
};
