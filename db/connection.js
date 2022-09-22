const mysql = require("mysql2");

const connection = mysql.createConnection({
  // mysql username and password to sign in to mysql
  host:"localhost",
  user:"root",
  password:"Shovit2535",
  database:"employees"
});

connection.connect(function(err) {
  if(err) throw err;
});

module.exports = connection;