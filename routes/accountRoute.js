// Needed Resources
const express = require('express')
const router = new express.Router()
const accController = require('../controllers/accController')
const regValidate = require('../utilities/account-validation')
const utilities = require('../utilities')

router.get("/login", accController.buildLogin);
router.get("/register", accController.buildRegister);


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
    (req, res) => {
      res.status(200).send('login process')
    }
  )
module.exports = router;