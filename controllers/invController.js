const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}


invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id)
    if (!data.length) {
      return res.status(404).send('No data found for this inventory ID');
    }
    const grid = await utilities.buildDetailGrid(data)
    let nav = await utilities.getNav()
    const invMake = data[0].inv_make
    const invName = data[0].inv_model
    const invYear = data[0].inv_year

    res.render("./inventory/detail", {
      title: invYear + " " + invMake + " " + invName,
      nav,
      grid,
      errors: null,
    })
  } catch (error) {
    next(error);
  }
}

invCont.ManageInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Manage Inventory",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error);
  }
}

invCont.AddClass = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error);
  }
}
invCont.AddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error);
  }
}
module.exports = invCont