const axios = require('axios');
require('dotenv').config();

// Barion strings
const BASE_URL = process.env.NODE_ENV ? process.env.BARION_API_BASE : 'https://api.test.barion.com/';
const PRIVATE_POS_KEY = process.env.NODE_ENV ? process.env.BARION_API_KEY : '8cd4af88ffa5471e960b3de7adc8e68d';

const START = 'v2/payment/start';

module.exports = function pay(objectrepository) {
  const { orderModel, ticketCategoryModel } = objectrepository;

  // TODO Return values etc

  return function payMW(req, res, next) {
    const { ticketCategoryId } = req.params;
    const quantity = Number(req.body.quantity);
    if (!quantity || quantity === 0) {
      req.session.sessionFlash = {
        type: 'danger',
        message: 'Req error.',
      };

      return next('Req error');
    }

    ticketCategoryModel.findOne({ _id: ticketCategoryId }, (err, ticketCategory) => {
      if (err) {
        return next(err);
      }
      if (!ticketCategory || !ticketCategory.enabled) {
        return next('Bad request');
      }
      let thetotal = 0;

      const { desc, price, title } = ticketCategory;
      thetotal = price * quantity;

      const InputProperties = {
        POSKey: PRIVATE_POS_KEY,
        PaymentType: 'Immediate',
        GuestCheckOut: 'true',
        FundingSources: ['All'],
        PaymentRequestId: req.session.user._id,
        RedirectUrl: 'http://tix.biro.wtf/thanks', // TODO links
        CallbackUrl: 'https://tix.biro.wtf/cb',
        Transactions: [{
          POSTransactionId: req.session.user._id,
          Payee: 'quick.biro@gmail.com', // TODO payee
          Total: thetotal,
          Items: [
            {
              Name: title,
              Description: desc,
              Quantity: quantity,
              Unit: 'db',
              UnitPrice: price,
              ItemTotal: thetotal,
            },
          ],
        }],
        Locale: 'hu-HU',
        Currency: 'HUF',
      };

      axios.post(BASE_URL + START, InputProperties, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        orderModel.create({
          title,
          desc,
          state: response.data.Status,
          total: thetotal,
          quantity,
          pid: response.data.PaymentId,
          _user: req.session.user._id,
        }, (errr) => {
          if (errr) {
            req.session.sessionFlash = {
              type: 'danger',
              message: 'DB error.',
            };

            return next(errr);
          }
        });
        return res.redirect(response.data.GatewayUrl);
      }).catch((error) => {
        console.error(error);
        return next(error);
      });
    });
  };
};
