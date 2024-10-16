// Needed Resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const invValidate = require('../utilities/inventory-validation')
const utilities = require('../utilities')

router.get("/getInventory/:classificationId", invController.getInventoryJSON);
router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/detail/:invId", invController.buildByInvId);
router.get("/", invController.ManageInventory);
router.get("/addClass", invController.AddClass);
router.get("/addInv", invController.AddInventory);
router.get("/edit/:invId", invController.EditInventory);
router.get("/delete/:invId", invController.deleteInventoryPage);

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
    invValidate.inventoryRules(),
    invValidate.checkUpdateData, 
    invController.updateInventory)


router.post("/del", invController.deleteInventory);
module.exports = router;