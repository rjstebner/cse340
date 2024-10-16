// Needed Resources
const express = require('express');
const router = new express.Router();
const accController = require('../controllers/accController');
const regValidate = require('../utilities/account-validation');
const utilities = require('../utilities'); // Correct import

router.get("/login", accController.buildLogin);
router.get("/register", accController.buildRegister);
router.get("/", accController.buildDefault); // Correct usage

/* POST */
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    accController.registerAccount
  )
  router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    accController.accountLogin
  )
module.exports = router;