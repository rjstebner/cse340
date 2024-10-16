const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accCont = {}

/* ****************************************
*  Deliver default account view
* *************************************** */
accCont.buildDefault = async function(req, res, next) {
    let nav = await utilities.getNav()
    console.log(req.session.email)
    res.render("account/index", {
      title: "Account",
      nav,
      loggedIn: req.session.loggedIn,
      clientName: req.session.clientName,
    })
  }
  

/* ****************************************
*  Deliver login view
* *************************************** */
accCont.buildLogin = async function(req, res, next) {
  let nav = await utilities.getNav();
  
  // Assuming you get the email from the request body
  const email = req.body.email;
  
  // Store the email in the session
  req.session.email = email;
  
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accCont.buildRegister = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }


/* ****************************************
* Update account information
* *************************************** */
accCont.updateAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(req.session.email)
    if (!accountData) {
      req.flash("notice", "Sorry, we couldn't find your account.")
      res.status(404).render("account/account-manage", {
        title: "Account Manager",
        nav,
        loggedIn: req.session.loggedIn,
        clientName: req.session.clientName,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      req.session.email = account_email,
      req.session.clientName = account_firstname

    )
    if (updateResult) {
      req.flash("notice", "Your account has been updated.")
      res.status(200).render("account/account-manage", {
        title: "Account Manager",
        nav,
        loggedIn: req.session.loggedIn,
        clientName: req.session.clientName,
        account_firstname,
        account_lastname,
        account_email,
      })
    } else {
      req.flash("notice", "Sorry, we couldn't update your account.")
      res.status(501).render("account/account-manage", {
        title: "Account Manager",
        nav,
        loggedIn: req.session.loggedIn,
        clientName: req.session.clientName,
        account_firstname,
        account_lastname,
        account_email,
      })
    }
  }

/* ****************************************
*  Change password
* *************************************** */
accCont.changePassword = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_password, account_new_password } = req.body
    const accountData = await accountModel.getAccountByEmail(req.session.email)
    if (!accountData) {
      req.flash("notice", "Sorry, we couldn't find your account.")
      res.status(404).render("account/account-manage", {
        title: "Account Manager",
        nav,
        loggedIn: req.session.loggedIn,
        clientName: req.session.clientName,
      })
      return
    }
    try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        const hashedPassword = await bcrypt.hash(account_new_password, 10)
        const updateResult = await accountModel.updatePassword(
          hashedPassword,
          req.session.email
        )
        if (updateResult) {
          req.flash("notice", "Your password has been updated.")
          res.status(200).render("account/account-manage", {
            title: "Account Manager",
            nav,
            loggedIn: req.session.loggedIn,
            clientName: req.session.clientName,
          })
        } else {
          req.flash("notice", "Sorry, we couldn't update your password.")
          res.status(501).render("account/account-manage", {
            title: "Account Manager",
            nav,
            loggedIn: req.session.loggedIn,
            clientName: req.session.clientName,
          })
        }
      } else {
        req.flash("notice", "Sorry, we couldn't update your password.")
        res.status(501).render("account/account-manage", {
          title: "Account Manager",
          nav,
          loggedIn: req.session.loggedIn,
          clientName: req.session.clientName,
        })
      }
    } catch (error) {
      return new Error("Access Forbidden")
    }
  }
  


  /* ****************************************
*  Process registration
* *************************************** */
accCont.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    
    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }



    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

/* ****************************************
 *  Process login request
 * ************************************ */
accCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   req.session.loggedIn = true;
   req.session.clientName = accountData.account_firstname;
    req.session.email = accountData.account_email;
    req.session.accountType = accountData.account_type;

   res.redirect("/account");
   } else {
     req.flash("notice", "Please check your credentials and try again.")
     res.status(400).render("account/login", {
       title: "Login",
       nav,
       errors: null,
       account_email,
     })
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
}

accCont.buildAccManager = async function (req, res) {
  let nav = await utilities.getNav()
  let accountData = await accountModel.getAccountByEmail(req.session.email)
  if (req.session.loggedIn) {
    res.render("account/account-manage", {
      title: "Account Manager",
      nav,
      loggedIn: req.session.loggedIn,
      clientName: req.session.clientName,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email
    })
  } else {
    res.redirect("/account/login")
  }
} 


/* ****************************************
*  Process logout request
* ************************************ */
accCont.accountLogout = function (req, res) {
  req.session.destroy();
  res.redirect("/");
}


  module.exports = accCont

