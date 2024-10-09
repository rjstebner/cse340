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

  module.exports = validate;