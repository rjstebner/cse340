// Needed Resources
const express = require('express')
const router = new express.Router()
const accController = require('../controllers/accController')

router.get("/login", accController.buildLogin);
router.get("/register", accController.buildRegister);

module.exports = router;