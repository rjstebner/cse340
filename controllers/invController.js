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

    const classifications = await invModel.getClassifications()
    const form = await utilities.buildInventoryForm(classifications)

    res.render("./inventory/management", {
      title: "Manage Inventory",
      nav,
      form,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.EditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  console.log(itemData[0].inv_color)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav()

  const {inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_id} = req.body
  let inv_image = "/images/vehicles/no-image.png"
  let inv_thumbnail = "/images/vehicles/no-image-tn.png"
  const updateResult = await invModel.updateInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id)

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.deleteInventoryPage = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)

  const data = await invModel.getInventoryByInvId(inv_id)
  let nav = await utilities.getNav()
  res.render("./inventory/delete-confirm", {
    title: "Delete " + data[0].inv_make + " " + data[0].inv_model,
    nav,
    errors: null,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_description: data[0].inv_description,
    inv_image: data[0].inv_image,
    inv_thumbnail: data[0].inv_thumbnail,
    inv_price: data[0].inv_price,
    inv_miles: data[0].inv_miles,
    inv_color: data[0].inv_color,
    classification_id: data[0].classification_id
  })
}


invCont.deleteInventory = async function (req, res) {
  const { inv_id } = req.body
  const result = await invModel.deleteInventory(inv_id)
  if (result) {
    req.flash("notice", "The inventory item was successfully deleted.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("/inv/")
  }
}
module.exports = invCont