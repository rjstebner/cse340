// Needed Resources 
const express = require("express")
const router = express.Router() 
const utilities = require("../utilities")
const accController = require("../controllers/accController")
const regValidate = require('../utilities/account-validation')

// Route to handle "My Account" link click
router.get("/login", utilities.handleErrors(accController.buildLogin))
router.get('/register', utilities.handleErrors(accController.buildRegister))
router.get('/', utilities.checkLogin, utilities.handleErrors(accController.buildAccManager))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
)
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
  )

module.exports = router;