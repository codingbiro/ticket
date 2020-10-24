module.exports = function getEvent(objectrepository) {
  const { eventModel } = objectrepository;

  return function getEventMW(req, res, next) {
    const eventId = String(req.params.eventId);
    eventModel.findOne({ _id: eventId }, (err, event) => {
      if (err) {
        return next(err);
      }
      if (!event || event.disabled) {
        return next('Bad request');
      }

      const safeEvent = {
        _id: event._id,
        img: event.img,
        title: event.title,
        desc: event.desc,
        price: event.price,
        date: event.date,
      };

      res.locals.event = safeEvent;

      return next();
    });
  };
};
