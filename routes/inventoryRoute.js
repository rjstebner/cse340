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
router.get("/edit/:invId", invController.EditInventory);
router.get("/update", invController.updateInventory);

/* POST */
router.post("/addClass", 
    invValidate.classificationRules(),
    invValidate.checkClassification,
    invController.processNewClassification);


router.post("/addInv",
    invValidate.inventoryRules(),
    invValidate.checkInventory,
    invController.processNewInventory);
    
    router.post("/update", 
        invController.updateInventory)

module.exports = router;