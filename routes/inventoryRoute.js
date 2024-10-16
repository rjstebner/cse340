// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const invValidate = require('../utilities/inventory-validation')
const utilities = require('../utilities')

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/detail/:invId", invController.buildByInvId);
router.get("/", invController.ManageInventory);
router.get("/addClass", invController.AddClass);
router.get("/addInv", invController.AddInventory);


/* POST */
router.post("/addClass", 
    invValidate.classificationRules(),
    invValidate.checkClassification,
    invController.processNewClassification);


router.post("/addInv",
    invValidate.inventoryRules(),
    invValidate.checkInventory,
    invController.processNewInventory);
    
module.exports = router;