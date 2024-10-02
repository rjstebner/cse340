const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const env = require('dotenv').config()
const app = express()
const static = require('./routes/static')
const baseController = require('./controllers/baseController')
const inventoryRoute = require('./routes/inventoryRoute')
const utilities = require('./utilities')

// Set the view engine and templates
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layouts/layout')


// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))


// Inventory Routes
app.use('/inv', inventoryRoute)

app.use(static)


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
* Express Error Handler
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

// Local Server Information
const port = process.env.PORT
const host = process.env.HOST 

// Log statement to confirm server operation
app.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`)
})