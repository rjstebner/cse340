const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}


validate.regRules = () => {
    return [
      // classification is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .withMessage("Please provide a classification with only letters.") // on error this message is sent.
        .isLength({ min: 2 })
        .withMessage("Please provide a classification."), // on error this message is sent.
    ]
  }

  validate.checkData = async (req, res, next) => {
        const { classification_name } = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            nav,
            classification_name
        })
        } else {
        next()
        }
    }
module.exports = validate;