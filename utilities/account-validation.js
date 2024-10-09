const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
      .trim() // Removes whitespace from both ends of the input.
      .escape() // Escapes HTML characters to prevent XSS attacks.
      .notEmpty() // Ensures the input is not empty.
      .isLength({ min: 1 }) // Ensures the input has a minimum length of 1 character.
      .withMessage("Please provide a first name."), // Sends this message if any of the above validations fail.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // Converts the email to a standardized format (lowercase, trimmed, and removing unnecessary characters) to ensure consistency and prevent duplicates.
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,      // Ensures the password is at least 12 characters long.
            minLowercase: 1,    // Ensures the password contains at least 1 lowercase letter.
            minUppercase: 1,    // Ensures the password contains at least 1 uppercase letter.
            minNumbers: 1,      // Ensures the password contains at least 1 number.
            minSymbols: 1,      // Ensures the password contains at least 1 special character (symbol).
          })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }
  
  module.exports = validate