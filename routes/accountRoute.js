// Needed Resources 
const express = require("express")
const router = express.Router() 
const accController = require("../controllers/accController")

// Route to handle "My Account" link click
router.get('/login', accController.buildLogin);


module.exports = router;