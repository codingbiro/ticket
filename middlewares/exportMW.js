const fs = require('fs');
// const path = require('path');
const slugify = require('slugify');

module.exports = function exportFn(objectrepository) {
  const { redeemableModel } = objectrepository;

  return function exportMW(req, res, next) {
    redeemableModel.findOne({ _id: req.params.id }, (err, redeemable) => {
      if (err) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'Server error.',
        };

        return next(err);
      }

      const codes = redeemable.allcode;

      const slug = slugify(redeemable.title, {
        replacement: '-', // replace spaces with replacement character, defaults to `-`
        remove: /[áéíóöőúüű]/g,
        lower: true, // convert to lower case, defaults to `false`
        strict: true,
      });

      const fileName = `${slug}-${Date.now()}.csv`;

      fs.writeFile(
        `./exports/${fileName}`,
        codes.join('\n'),
        (errrrr) => {
          if (errrrr) {
            console.log(errrrr);
            req.session.sessionFlash = {
              type: 'danger',
              message: 'Server error.',
            };

            return next();
          }

          // const filea = `${__dirname}/exports/${fileName}`;
          // TODO
          return res.download(`/var/www/endorse/exports/${fileName}`, (errrr) => {
            if (errrr) {
              console.log(errrr);

              req.session.sessionFlash = {
                type: 'danger',
                message: 'Server error.',
              };

              return next();
            }
          });
        },
      );
    });
  };
};
