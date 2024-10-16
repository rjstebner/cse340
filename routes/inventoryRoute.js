// routes/inventoryRoute.js
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const invValidate = require('../utilities/inventory-validation');
const utilities = require('../utilities');
const authMiddleware = require('../utilities/authMiddleware');

router.get("/getInventory/:classificationId", invController.getInventoryJSON);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);
router.get("/", authMiddleware, invController.ManageInventory);
router.get("/addClass", authMiddleware, invController.AddClass);
router.get("/addInv", authMiddleware, invController.AddInventory);
router.get("/edit/:invId", authMiddleware, invController.EditInventory);
router.get("/delete/:invId", authMiddleware, invController.deleteInventoryPage);

/* POST */
router.post("/addClass", 
    authMiddleware,
    invValidate.classificationRules(),
    invValidate.checkClassification,
    invController.processNewClassification);

router.post("/addInv",
    authMiddleware,
    invValidate.inventoryRules(),
    invValidate.checkInventory,
    invController.processNewInventory);
    
router.post("/update",
    authMiddleware,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData, 
    invController.updateInventory);

router.post("/del", authMiddleware, invController.deleteInventory);

module.exports = router;