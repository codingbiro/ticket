const addRedeemableMW = require('../middlewares/redeem/addRedeemableMW');
const adminOnlyMW = require('../middlewares/auth/adminOnlyMW');
const authMW = require('../middlewares/auth/authMW');

const barionCBMW = require('../middlewares/payment/barionCBMW');

const canRedeemMW = require('../middlewares/redeem/canRedeemMW');
const canRegisterMW = require('../middlewares/auth/canRegisterMW');
const canResetPassMW = require('../middlewares/auth/canResetPassMW');
const checkPassMW = require('../middlewares/auth/checkPassMW');
const checkPassMW2 = require('../middlewares/auth/checkPassMW2');
const createRedeemTransactionMW = require('../middlewares/redeem/createRedeemTransactionMW');

const disableRedeemableMW = require('../middlewares/redeem/disableRedeemableMW');

const enableRedeemableMW = require('../middlewares/redeem/enableRedeemableMW');
const exportMW = require('../middlewares/exportMW');

const getOrdersMW = require('../middlewares/payment/getOrdersMW');
const getRedeemablesMW = require('../middlewares/redeem/getRedeemablesMW');

const ifEnableRedeemableMW = require('../middlewares/redeem/ifEnableRedeemableMW');
const ifDisableRedeemableMW = require('../middlewares/redeem/ifDisableRedeemableMW');

const logoutMW = require('../middlewares/auth/logoutMW');

const payMW = require('../middlewares/payment/payMW');

const redeemMW = require('../middlewares/redeem/redeemMW');
const redirectLoggedInMW = require('../middlewares/redirectLoggedInMW');
const redirectMW = require('../middlewares/redirectMW');
const redirectToLastViewMW = require('../middlewares/redirectToLastViewMW');
const registerMW = require('../middlewares/auth/registerMW');
const renderMW = require('../middlewares/renderMW');
const resetPassMW = require('../middlewares/auth/resetPassMW');
const resetPassWithTokenMW = require('../middlewares/auth/resetPassWithTokenMW');

const saveProfileDataMW = require('../middlewares/user/saveProfileDataMW');

const utils = require('../misc/utils');

const userModel = require('../models/user');
const eventModel = require('../models/event');
const ticketModel = require('../models/ticket');
const resetModel = require('../models/reset');
const orderModel = require('../models/order');

module.exports = function application(app) {
  const objRepo = {
    userModel,
    eventModel,
    ticketModel,
    orderModel,
    resetModel,
  };

  app.get('/',
    (req, res, next) => (req.session.user ? res.redirect('/dashboard') : next()),
    renderMW('index'));

  app.post('/',
    checkPassMW(objRepo),
    redirectToLastViewMW());

  app.get('/auth/magic', checkPassMW2(objRepo));

  app.post('/cb',
    barionCBMW(objRepo),
    (req, res) => res.sendStatus(200));

  app.get('/logout',
    logoutMW());

  app.get('/pay/:coins',
    authMW(objRepo),
    adminOnlyMW(),
    payMW(objRepo));

  app.get('/dashboard',
    authMW(objRepo, 'dashboard'),
    renderMW('dashboard/index'));

  app.get('/add',
    authMW(objRepo, 'add'),
    adminOnlyMW(),
    renderMW('add'));

  app.post('/add',
    authMW(objRepo, 'add'),
    adminOnlyMW(),
    addRedeemableMW(objRepo),
    redirectMW('admin'));

  app.get('/export/:id',
    authMW(objRepo, 'admin'),
    adminOnlyMW(),
    exportMW(objRepo),
    redirectMW('admin'));

  app.get('/profile',
    authMW(objRepo, 'profile'),
    renderMW('profile'));

  app.post('/profile',
    authMW(objRepo, 'profile'),
    saveProfileDataMW(objRepo),
    redirectMW('profile'));

  app.get('/admin',
    authMW(objRepo, 'admin'),
    adminOnlyMW(),
    getRedeemablesMW(objRepo),
    renderMW('admin'));

  app.get('/enable/:id',
    authMW(objRepo, 'admin'),
    adminOnlyMW(),
    ifEnableRedeemableMW(objRepo),
    enableRedeemableMW(objRepo),
    redirectMW('admin'));

  app.get('/disable/:id',
    authMW(objRepo, 'admin'),
    adminOnlyMW(),
    ifDisableRedeemableMW(objRepo),
    disableRedeemableMW(objRepo),
    redirectMW('admin'));

  app.get('/events',
    authMW(objRepo, 'spend'),
    getRedeemablesMW(objRepo),
    renderMW('spend'));

  app.get('/redeem/:id',
    authMW(objRepo, 'spend'),
    canRedeemMW(objRepo),
    redeemMW(objRepo),
    createRedeemTransactionMW(objRepo), // TODO from _name_
    (req, res, next) => { utils.sendMail('redeem', 'Your redeem code from endorse.biro.wtf', `Your redeem code: ${res.locals.theCode}. Valid for 12 months.`, req.session.user.email, req.session.user.name); next(); },
    redirectMW('spend'));

  app.get('/iforgot',
    renderMW('iforgot'));

  app.post('/iforgot',
    canResetPassMW(objRepo),
    resetPassMW(objRepo),
    redirectMW(''));

  app.get('/refreshOrder',
    barionCBMW(objRepo),
    redirectMW('orders'));

  app.get('/orders',
    authMW(objRepo),
    getOrdersMW(objRepo),
    renderMW('orders'));

  app.get('/thanks',
    authMW(objRepo),
    renderMW('thanks'));

  app.get('/register',
    redirectLoggedInMW(),
    renderMW('register'));

  app.post('/register',
    canRegisterMW(objRepo),
    registerMW(objRepo),
    redirectMW('register'));

  app.get('/resetpassword/:token',
    renderMW('resetpassword'));

  app.post('/resetpassword/:token',
    resetPassWithTokenMW(objRepo),
    redirectMW(''));
};
