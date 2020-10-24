module.exports = function addEvent(objectrepository) {
  const { eventModel } = objectrepository;

  return function addEventMW(req, res, next) {
    const desc = req.body.desc ? req.body.desc : null;
    const title = req.body.title ? req.body.title : null;
    const img = req.file ? req.file : null;
    const imgPath = img ? img.path : null;
    const date = req.body.date ? req.body.date : null;
    const price = req.body.price ? req.body.price : null;

    const newEvent = {
      desc,
      title,
      price,
      date: new Date(date),
      img: imgPath,
    };

    eventModel.create(
      newEvent,
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
          message: 'New event has been created.',
        };

        return next();
      },
    );
  };
};
