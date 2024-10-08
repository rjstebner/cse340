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
    const classifications = await invModel.getClassifications()
    const form = await utilities.buildInventoryForm(classifications)
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      form,
      errors: null,
    })
  } catch (error) {
    next(error);
  }
}

// Process the new classification

invCont.processNewClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result.rowCount === 1) {
    req.flash("notice", "Classification added successfully.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, there was an error adding the classification.")
    res.redirect("/inv/addClass")
  }
}


invCont.processNewInventory = async function (req, res) {
  let nav = await utilities.getNav()

  const {inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id} = req.body
  let inv_image = "/images/vehicles/no-image.png"
  let inv_thumbnail = "/images/vehicles/no-image-tn.png"
  const result = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  if (result.rowCount === 1) {
    req.flash("notice", "Inventory added successfully.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, there was an error adding the inventory.")
    res.redirect("/inv/addInv")
  }
}
module.exports = invCont