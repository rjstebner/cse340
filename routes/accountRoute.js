// Needed Resources
const express = require('express');
const router = new express.Router();
const accController = require('../controllers/accController');
const regValidate = require('../utilities/account-validation');
const utilities = require('../utilities'); 

router.get("/login", accController.buildLogin);
router.get("/register", accController.buildRegister);
router.get("/", accController.buildDefault);
router.get("/logout", accController.accountLogout);
router.get("/manage", accController.buildAccManager);
router.get('/employees', accController.getEmployees);


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

router.post("/accountUpdate", accController.updateAccount);
router.post('/delete/:id', accController.deleteEmployee); // Add this line

router.post("/changePass", accController.changePassword);
module.exports = router;