const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const env = require('dotenv').config()
const app = express()
const static = require('./routes/static')
const baseController = require('./controllers/baseController')
const inventoryRoute = require('./routes/inventoryRoute')
const accountRoute = require('./routes/accountRoute')
const accController = require('./controllers/accController')
const utilities = require('./utilities')
const session = require('express-session')
const pool = require('./database')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const accCont = require('./controllers/accController')



// Middleware

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())
app.use(utilities.checkJWTToken)


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Set the view engine and templates
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layouts/layout')


// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))


// Inventory Routes
app.use('/inv', utilities.handleErrors(inventoryRoute));

// Account Routes
app.use('/account', utilities.handleErrors(accountRoute));
app.use('/account/', utilities.checkLogin, utilities.handleErrors(accCont.buildDefault));

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