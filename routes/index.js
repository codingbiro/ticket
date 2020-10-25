const addEventMW = require('../middlewares/event/addEventMW');
const addTicketsMW = require('../middlewares/ticket/addTicketsMW');
const addTicketCategoryMW = require('../middlewares/ticket/addTicketCategoryMW');

const adminOnlyMW = require('../middlewares/auth/adminOnlyMW');
const authMW = require('../middlewares/auth/authMW');

const barionCBMW = require('../middlewares/payment/barionCBMW');

const canRegisterMW = require('../middlewares/auth/canRegisterMW');
const canResetPassMW = require('../middlewares/auth/canResetPassMW');
const checkPassMW = require('../middlewares/auth/checkPassMW');
const checkPassMW2 = require('../middlewares/auth/checkPassMW2');

const exportMW = require('../middlewares/exportMW');

const getOrdersMW = require('../middlewares/payment/getOrdersMW');
const getEventsMW = require('../middlewares/event/getEventsMW');
const getEventMW = require('../middlewares/event/getEventMW');
const getTicketCategoriesMW = require('../middlewares/ticket/getTicketCategoriesMW');
const getTicketCategoryMW = require('../middlewares/ticket/getTicketCategoryMW');
const getTicketsMW = require('../middlewares/ticket/getTicketsMW');

const logoutMW = require('../middlewares/auth/logoutMW');

const payMW = require('../middlewares/payment/payMW');

const redirectLoggedInMW = require('../middlewares/redirectLoggedInMW');
const redirectMW = require('../middlewares/redirectMW');
const redirectToLastViewMW = require('../middlewares/redirectToLastViewMW');
const registerMW = require('../middlewares/auth/registerMW');
const renderMW = require('../middlewares/renderMW');
const reservationMW = require('../middlewares/reservationMW');
const resetPassMW = require('../middlewares/auth/resetPassMW');
const resetPassWithTokenMW = require('../middlewares/auth/resetPassWithTokenMW');

const saveProfileDataMW = require('../middlewares/user/saveProfileDataMW');

const utils = require('../misc/utils');

const userModel = require('../models/user');
const eventModel = require('../models/event');
const ticketModel = require('../models/ticket');
const ticketCategoryModel = require('../models/ticketCategory');
const resetModel = require('../models/reset');
const reservationModel = require('../models/reservation');
const orderModel = require('../models/order');

module.exports = function application(app) {
  const objRepo = {
    userModel,
    eventModel,
    ticketModel,
    orderModel,
    resetModel,
    reservationModel,
    ticketCategoryModel,
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

  app.get('/dashboard',
    authMW(objRepo),
    renderMW('dashboard/index'));

  app.get('/add',
    authMW(objRepo),
    adminOnlyMW(),
    (req, res, next) => { res.locals.timeNow = utils.timeNow; next(); },
    renderMW('add'));

  app.post('/add',
    authMW(objRepo),
    adminOnlyMW(),
    addEventMW(objRepo),
    redirectMW('admin'));

  app.get('/export/:id',
    authMW(objRepo, 'admin'),
    adminOnlyMW(),
    exportMW(objRepo),
    redirectMW('admin'));

  app.get('/profile',
    authMW(objRepo),
    renderMW('profile'));

  app.post('/profile',
    authMW(objRepo),
    saveProfileDataMW(objRepo),
    redirectMW('profile'));

  app.get('/admin',
    authMW(objRepo),
    adminOnlyMW(),
    getEventsMW(objRepo),
    renderMW('admin'));

  app.get('/admin/event/:eventId',
    authMW(objRepo, 'admin'),
    adminOnlyMW(),
    getEventMW(objRepo),
    getTicketCategoriesMW(objRepo),
    renderMW('adminEvent'));

  app.get('/admin/event/:eventId/add',
    authMW(objRepo),
    adminOnlyMW(),
    getEventMW(objRepo),
    getTicketCategoriesMW(objRepo),
    renderMW('addTicketCategory'));

  app.post('/admin/event/:eventId/add',
    authMW(objRepo),
    adminOnlyMW(),
    addTicketCategoryMW(objRepo),
    redirectMW('admin'));

  app.get('/admin/event/:eventId/:ticketCategoryId',
    authMW(objRepo),
    adminOnlyMW(),
    addTicketsMW(objRepo),
    redirectMW('admin'));

  app.get('/events',
    authMW(objRepo, 'events'),
    getEventsMW(objRepo),
    renderMW('events'));

  app.get('/tickets',
    authMW(objRepo, 'tickets'),
    getTicketsMW(objRepo),
    renderMW('tickets'));

  app.get('/event/:eventId',
    authMW(objRepo, 'events'),
    getEventMW(objRepo),
    getTicketCategoriesMW(objRepo),
    renderMW('event'));

  app.get('/buy/:eventId/:ticketCategoryId',
    authMW(objRepo),
    getEventMW(objRepo),
    getTicketCategoryMW(objRepo),
    renderMW('buyTicket'));

  app.post('/buy/:eventId/:ticketCategoryId',
    authMW(objRepo),
    reservationMW(objRepo),
    payMW(objRepo));

  // (req, res, next) => { utils.sendMail('redeem', 'Your redeem code from tix.biro.wtf', `Your redeem code: ${res.locals.theCode}. Valid for 12 months.`, req.session.user.email, req.session.user.name); next(); },

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
