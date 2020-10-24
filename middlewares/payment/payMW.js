const axios = require('axios');
require('dotenv').config();

// Barion strings
const BASE_URL = process.env.NODE_ENV ? process.env.BARION_API_BASE : 'https://api.test.barion.com/';
const PRIVATE_POS_KEY = process.env.NODE_ENV ? process.env.BARION_API_KEY : '8cd4af88ffa5471e960b3de7adc8e68d';

const START = 'v2/payment/start';

module.exports = function pay(objectrepository) {
  const { orderModel } = objectrepository;

  return function payMW(req, res, next) {
    const thecoins = Number(req.params.coins);
    let thetotal = 0;

    switch (thecoins) {
      case 10000: thetotal = 100; break;
      case 25000: thetotal = 200; break;
      default: req.session.sessionFlash = { type: 'danger', message: 'Invalid request.' }; return res.redirect('/admin');
    }

    const InputProperties = {
      POSKey: PRIVATE_POS_KEY,
      PaymentType: 'Immediate',
      GuestCheckOut: 'true',
      FundingSources: ['All'],
      PaymentRequestId: req.session.user._id,
      RedirectUrl: 'https://endorse.biro.wtf/thanks', // TODO links
      CallbackUrl: 'https://endorse.biro.wtf/cb',
      Transactions: [{
        POSTransactionId: req.session.user._id,
        Payee: 'quick.biro@gmail.com',
        Total: thetotal,
        Items: [
          {
            Name: 'Coin package',
            Description: thecoins,
            Quantity: 1,
            Unit: 'db',
            UnitPrice: thetotal,
            ItemTotal: thetotal,
          },
        ],
      }],
      Locale: 'hu-HU',
      Currency: 'EUR',
    };

    axios.post(BASE_URL + START, InputProperties, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      orderModel.create({
        title: 'Coin package', desc: thecoins, state: response.data.Status, total: thetotal, pid: response.data.PaymentId, _user: req.session.user._id,
      }, (err) => {
        if (err) {
          req.session.sessionFlash = {
            type: 'danger',
            message: 'DB error.',
          };

          return next(err);
        }
      });
      return res.redirect(response.data.GatewayUrl);
    }).catch((error) => {
      console.error(error);
      return next(error);
    });
    return next('error');
  };
};
