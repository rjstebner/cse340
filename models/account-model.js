const pool = require("../database")


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }
  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}
/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}


/* *****************************
* update account information
* ***************************** */
async function updateAccount(account_firstname, account_lastname, account_email){
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2 WHERE account_email = $3"
    return await pool.query(sql, [account_firstname, account_lastname, account_email])
  } catch (error) {
    return error.message
  }
}
async function updatePassword(account_password){
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_email = $2"
    return await pool.query(sql, [account_password, account_email])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Get all employees
* ***************************** */

async function getEmployees() {
  try {
    const sql = "SELECT account_firstname, account_lastname, account_email, account_id FROM account WHERE account_type = 'Employee'";
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
* Delete employee by id
* ***************************** */

async function deleteEmployeeById(id) {
  try {
    const sql = "DELETE FROM account WHERE account_id = $1";
    const result = await pool.query(sql, [id]);
    return result.rowCount;
  } catch (error) {
    return error.message;
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, updateAccount, updatePassword, getEmployees, deleteEmployeeById };