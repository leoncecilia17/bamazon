var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "cecilia",
    password: "Sagelove69!17",
    database: "bamazon"
});

connection.connect(function (error) {
    if (error) throw error;
    viewProducts();
});

function viewProducts() {
    console.log(" \n Sage's Pup Shop \n ");
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function (error, response) {
        if (error) throw error;
        console.table(response);
        userSelection();
    });
};

function inputValidator(input) {
    var asNumber = parseInt(input);
    return !isNaN(asNumber) ? true : "Please enter a number";
}

function userSelection() {
    inquirer.prompt([
        {
            name: "idSelection",
            type: "input",
            message: "What is the id of the item you would like to purchase?",
            validate: inputValidator
        },
        {
            name: "quantitySelection",
            type: "input",
            message: "How many would you like to buy?",
            validate: inputValidator

        }
    ]).then(function (input) {
        connection.query("SELECT * FROM products WHERE item_id=?", [input.idSelection.trim()], function (error, response) {
            if (error) throw error;
            if (response.length === 0) {
                console.log("That product id does not exist. Please enter another id number.");
            }
            else {
                stockUpdate(response[0], input.quantitySelection, input.idSelection);
            }
        });
    }).catch(function (error) {
        console.log(error);
    });
}

function stockUpdate(item, quantity, id) {
    if (item.stock_quantity >= quantity) {
        var newStockQuantity = item.stock_quantity - quantity;
        connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [newStockQuantity, id.trim()], function (error, response) {
            if (error) throw error;
            console.log("Your sale total is: " + "$" + item.price * quantity)
            // shopAgain(); 
        });
    }
    else {
        console.log("There is not enough in stock to make this sale. Please select a different quantity.")
        // userSelection(); 
    }
}

// function shopAgain(){
//     inquirer.prompt([
//         name: "shopAgain", 
//         type: "input"
//     ]).then()
// }
