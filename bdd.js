var mysql = require('mysql');
var monk = require('monk');
module.exports = monk('localhost:8080/');

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "roller24",
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  database : 'frenchyoutube'
});