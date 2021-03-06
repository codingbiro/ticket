const axios = require('axios');
require('dotenv').config();

// Barion strings
const BASE_URL = process.env.NODE_ENV ? process.env.BARION_API_BASE : 'https://api.test.barion.com/';
const PRIVATE_POS_KEY = process.env.NODE_ENV ? process.env.BARION_API_KEY : '8cd4af88ffa5471e960b3de7adc8e68d';

const STATE = 'v2/payment/getpaymentstate';

module.exports = function barionCB(objectrepository) {
  const { reservationModel, orderModel, ticketModel, transactionModel, userModel } = objectrepository;

  return function barionCBMW(req, res, next) {
    const theid = req.query.paymentId;
    const PARAMS = `?POSKey=${PRIVATE_POS_KEY}&PaymentId=${theid}`;

    axios.get(BASE_URL + STATE + PARAMS).then(async (response) => {
      if (response) {
        try {
          const theorder = await orderModel.findOneAndUpdate({ pid: theid }, {
            state: response.data.Status,
            discharged: response.data.Status === 'Succeeded',
          }, {
            useFindAndModify: false,
            runValidators: true,
          });
          const theuser = await userModel.findOne({ _id: theorder._user });
          if (response.data.Status === 'Succeeded') {
            const reserv = await reservationModel.findOne({ _user: theuser._id });

            if (!reserv) {
              console.error('err no reserv');
              req.session.sessionFlash = {
                type: 'danger',
                message: 'No reservation found.',
              };
            }

            const tickets = theuser._ticket ? [...theuser._ticket, ...reserv._ticket] : reserv._ticket;

            await userModel.findOneAndUpdate({ _id: theorder._user }, {
              _ticket: tickets,
            }, {
              useFindAndModify: false,
              runValidators: true,
            });
            await reservationModel.findOneAndUpdate({ _user: theorder._user, valid: true }, {
              valid: false,
            }, {
              useFindAndModify: false,
              runValidators: true,
            });

            // TODO !!!!
          } else if (response.data.Status === 'Expired' || response.data.Status === 'Canceled') {
            await reservationModel.findOneAndUpdate({ _user: theuser._id, valid: true }, {
              valid: false,
            }, {
              useFindAndModify: false,
              runValidators: true,
            });
          }
        } catch (e) {
          console.error(e);
          req.session.sessionFlash = {
            type: 'danger',
            message: 'Server error.',
          };

          return next(e);
        }
        return next();
      }
      return next();
    }).catch((error) => {
      console.log(error);
      return next(error);
    });
  };
};
