const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
    return [
      // classification name is required and must be string
    body("classification_name")
      .trim() 
      .escape() 
      .notEmpty() 
      .isLength({ min: 1 }) 
      .matches(/[A-Z]/)
      .withMessage("Please provide a valid classification name.")

    ];
}

validate.checkClassification = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: errors.array(),
      })
    } else {
      next()
    }
  }


  validate.inventoryRules = () => {
    return [
        // Make is required and must be a string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Make is required.")
            .isString()
            .withMessage("Make must be a string."),
        
        // Model is required and must be a string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Model is required.")
            .isString()
            .withMessage("Model must be a string."),
        
        // Year is required, must be numeric, and must be 4 digits
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Year is required.")
            .isLength({ min: 4, max: 4 })
            .withMessage("Year must be 4 digits.")
            .isNumeric()
            .withMessage("Year must be numeric."),
        
        // Description is required and must be a string
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Description is required.")
            .isString()
            .withMessage("Description must be a string."),
        
        // Price is required, must be numeric, and must be a positive number
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Price is required.")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),
        
        // Miles is required, must be numeric, and must be a non-negative number
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Miles is required.")
            .isInt({ min: 0 })
            .withMessage("Miles must be a non-negative number."),
        
        // Color is required and must be a string
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Color is required.")
            .isString()
            .withMessage("Color must be a string.")
    ];
};

validate.checkInventory = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors: errors.array(),
      })
    } else {
      next()
    }
  }

  module.exports = validate;