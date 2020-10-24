const axios = require('axios');
require('dotenv').config();

// Barion strings
const BASE_URL = process.env.NODE_ENV ? process.env.BARION_API_BASE : 'https://api.test.barion.com/';
const PRIVATE_POS_KEY = process.env.NODE_ENV ? process.env.BARION_API_KEY : '8cd4af88ffa5471e960b3de7adc8e68d';

const STATE = 'v2/payment/getpaymentstate';

module.exports = function barionCB(objectrepository) {
  const { orderModel } = objectrepository;
  const { userModel } = objectrepository;
  const { transactionModel } = objectrepository;

  return function barionCBMW(req, res, next) {
    const theid = req.query.paymentId;
    const PARAMS = `?POSKey=${PRIVATE_POS_KEY}&PaymentId=${theid}`;

    axios.get(BASE_URL + STATE + PARAMS).then(async (response) => {
      if (response) {
        try {
          if (response.data.Status === 'Succeeded') {
            const theorder = await orderModel.findOneAndUpdate({ pid: theid }, {
              state: response.data.Status,
              discharged: true,
            }, {
              useFindAndModify: false,
              runValidators: true,
            });

            const theuser = await userModel.findOne({ _id: theorder._user });

            await userModel.findOneAndUpdate({ _id: theorder._user }, {
              balance: theuser.balance + Number(theorder.desc),
            }, {
              useFindAndModify: false,
              runValidators: true,
            });

            await transactionModel.create({
              title: `${theorder.desc} Coin purchase`,
              type: 'purchase',
              _from: theuser._id,
              total: theorder.total,
            });
          } else {
            await orderModel.findOneAndUpdate({ pid: theid }, {
              state: response.data.Status,
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
