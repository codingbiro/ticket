const UserModel = require('../models/user');

module.exports = function createAdminUser() {
  const newUser = new UserModel();
  newUser.name = 'Admin';
  newUser.email = 'admin@birovince.com';
  newUser.password = 'admin@birovince.com';
  newUser.isAdmin = true;
  newUser.save((err) => console.log(err));
};
