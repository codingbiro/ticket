module.exports = function getEvents(objectrepository) {
  const { eventModel } = objectrepository;

  return function getEventsMW(req, res, next) {
    eventModel.find({}, (err, events) => {
      if (err) {
        return next(err);
      }

      const safeEvents = [];
      for (const event of events) {
        if (!event.disabled) {
          safeEvents.push({
            _id: event._id,
            img: event.img,
            title: event.title,
            desc: event.desc,
            price: event.price,
            date: event.date,
          });
        }
      }

      res.locals.events = safeEvents;

      return next();
    });
  };
};
