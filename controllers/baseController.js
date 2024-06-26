const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  req.flash('notice', 'Welcome to the Home Page')
  res.render("index", {title: "Home", nav})
}

baseController.triggerError = function(req, res, next) {
  next(new Error('Intentional error'));
}

module.exports = baseController