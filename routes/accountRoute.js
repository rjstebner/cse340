// Needed Resources 
const express = require("express")
const router = express.Router() 
const utilities = require("../utilities")
const accController = require("../controllers/accController")

// Route to handle "My Account" link click
router.get("/login", utilities.handleErrors(accController.buildLogin))
router.get('/register', utilities.handleErrors(accController.buildRegister))
router.post('/register', utilities.handleErrors(accController.registerAccount))

module.exports = router;