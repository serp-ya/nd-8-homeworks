const contactsBookRestRoutes = require('./contacts-book-rest-routes');

module.exports = (app, db) => {
  contactsBookRestRoutes(app, db);
  // Other routes in the future
};