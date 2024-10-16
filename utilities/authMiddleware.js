// utilities/authMiddleware.js
const jwt = require('jsonwebtoken');
const utilities = require('./index');
require('dotenv').config();

 authMiddleware = async function (req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash("notice", "You must be logged in to access this page.");
    return res.status(401).render("account/login", {
      title: "Login",
      nav: await utilities.getNav(),
      errors: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded.account_type !== 'Employee' && decoded.account_type !== 'Admin') {
      req.flash("notice", "You do not have permission to access this page.");
      return res.status(403).render("account/login", {
        title: "Login",
        nav: await utilities.getNav(),
        errors: null,
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    req.flash("notice", "Invalid token. Please log in again.");
    return res.status(401).render("account/login", {
      title: "Login",
      nav: await utilities.getNav(),
      errors: null,
    });
  }
};

module.exports = authMiddleware;