const addEventMW = require('../middlewares/event/addEventMW');
const addTicketCategoryMW = require('../middlewares/ticket/addTicketCategoryMW');
const addTicketsMW = require('../middlewares/ticket/addTicketsMW');
const adminOnlyMW = require('../middlewares/auth/adminOnlyMW');
const authMW = require('../middlewares/auth/authMW');
const barionCBMW = require('../middlewares/payment/barionCBMW');
const canRegisterMW = require('../middlewares/auth/canRegisterMW');
const canResetPassMW = require('../middlewares/auth/canResetPassMW');
const checkPassMW = require('../middlewares/auth/checkPassMW');
const checkPassMW2 = require('../middlewares/auth/checkPassMW2');
const exportMW = require('../middlewares/exportMW');
const getEventMW = require('../middlewares/event/getEventMW');
const getEventsMW = require('../middlewares/event/getEventsMW');
const getOrdersMW = require('../middlewares/payment/getOrdersMW');
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
const thanksMW = require('../middlewares/thanksMW');

const utils = require('../misc/utils');

const userModel = require('../models/user');
const eventModel = require('../models/event');
const ticketModel = require('../models/ticket');
const ticketCategoryModel = require('../models/ticketCategory');
const resetModel = require('../models/reset');
const reservationModel = require('../models/reservation');
const orderModel = require('../models/order');

module.exports = function application(app) {
  const objRepo = { // MODELS
    userModel,
    eventModel,
    ticketModel,
    orderModel,
    resetModel,
    reservationModel,
    ticketCategoryModel,
  };

  // PUBLIC ENDPOINTS //
  //
  app.get('/',
    (req, res, next) => (req.session.user ? res.redirect('/dashboard') : next()),
    renderMW('index'));
  app.post('/',
    checkPassMW(objRepo),
    redirectToLastViewMW());

  // AUTHENTICATED ENDPOINTS //
  //
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
  app.get('/profile',
    authMW(objRepo),
    renderMW('profile'));
  app.post('/profile',
    authMW(objRepo),
    saveProfileDataMW(objRepo),
    redirectMW('profile'));
  app.get('/events',
    authMW(objRepo),
    getEventsMW(objRepo),
    renderMW('events'));
  app.get('/event/:eventId',
    authMW(objRepo),
    getEventMW(objRepo),
    getTicketCategoriesMW(objRepo),
    renderMW('event'));
  app.get('/tickets',
    authMW(objRepo),
    getTicketsMW(objRepo),
    renderMW('tickets'));
  app.get('/orders',
    authMW(objRepo),
    getOrdersMW(objRepo),
    renderMW('orders'));

  // ADMIN ENDPOINTS //
  //
  app.get('/admin', // ADMIN HOMEPAGE
    authMW(objRepo),
    adminOnlyMW(),
    getEventsMW(objRepo),
    renderMW('admin'));
  app.get('/admin/event/:eventId', // ADMIN EVENTS
    authMW(objRepo),
    adminOnlyMW(),
    getEventMW(objRepo),
    getTicketCategoriesMW(objRepo),
    renderMW('adminEvent'));
  app.get('/admin/event/:eventId/add', // ADD EVENT
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
  app.get('/admin/event/:eventId/:ticketCategoryId', // ADD TICKETCATEGORY
    authMW(objRepo),
    adminOnlyMW(),
    addTicketsMW(objRepo),
    redirectMW('admin'));

  // PAYMENT ENDPOINTS //
  //
  app.get('/buy/:eventId/:ticketCategoryId', // BUY TICKET
    authMW(objRepo),
    getEventMW(objRepo),
    getTicketCategoryMW(objRepo),
    renderMW('buyTicket'));
  app.post('/buy/:eventId/:ticketCategoryId',
    authMW(objRepo),
    reservationMW(objRepo),
    payMW(objRepo));
  app.post('/cb', // BARION CALLBACK
    barionCBMW(objRepo),
    (req, res) => res.sendStatus(200));
  app.get('/thanks', // BARION REDIRECT PAGE
    authMW(objRepo),
    thanksMW(objRepo),
    renderMW('thanks'));

  // AUTHENTICATION ENDPOINTS //
  //
  app.get('/auth/magic', checkPassMW2(objRepo)); // MAGIC LOGIN
  app.get('/logout', // LOGOUT
    logoutMW());
  app.get('/register', // REGISTER
    redirectLoggedInMW(),
    renderMW('register'));
  app.post('/register',
    canRegisterMW(objRepo),
    registerMW(objRepo),
    redirectMW('register'));
  app.get('/iforgot', // RESET PASSWORD
    renderMW('iforgot'));
  app.post('/iforgot',
    canResetPassMW(objRepo),
    resetPassMW(objRepo),
    redirectMW(''));
  app.get('/resetpassword/:token', // RESET PASSWORD WITH TOKEN
    renderMW('resetpassword'));
  app.post('/resetpassword/:token',
    resetPassWithTokenMW(objRepo),
    redirectMW(''));

  // UNUSED *****
  app.get('/refreshOrder',
    barionCBMW(objRepo),
    redirectMW('orders'));  
  app.get('/export/:id',
    authMW(objRepo, 'admin'),
    adminOnlyMW(),
    exportMW(objRepo),
    redirectMW('admin'));
  // (req, res, next) => { utils.sendMail('redeem', 'Your redeem code from tix.biro.wtf',
  // `Your redeem code: ${res.locals.theCode}. Valid for 12 months.`, req.session.user.email, req.session.user.name); next(); },
};
