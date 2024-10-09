// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);
router.get("/", invController.ManageInventory);
router.get("/addClass", invController.AddClass);
router.get("/addInv", invController.AddInventory);

module.exports = router;