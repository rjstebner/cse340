// sessionMiddleware.js
module.exports = function (req, res, next) {
    res.locals.loggedIn = req.session.loggedIn || false;
    res.locals.clientName = req.session.clientName || '';
    next();
  };