var mysql = require("mysql"); 
// var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost", 
    port: 3306, 
    user: "cecilia", 
    password: "Sagelove69!17", 
    database: "bamazon"
});

connection.connect(function(error){
    if(error) throw error; 
})