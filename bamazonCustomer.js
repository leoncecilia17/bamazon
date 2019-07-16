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

connection.connect(function(error){
    if(error) throw error; 
    viewProducts(); 
}); 

function viewProducts(){
    console.log (" \n Sage's Pup Shop \n "); 
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(error, response){
        if (error) throw error; 
        console.table(response); 
        userSelection(); 
    });
};

function inputValidator(input){
    var asNumber = parseInt(input);

    return !isNaN(asNumber) ? true : 'You must enter a number value';
}

function userSelection(){
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
    ]).then(function(input){
        //Write a mysql query to fetch the product with the Id suer gave us
        //Check for stock quantity if enough sell, if not let yuser know we did not have enough
        connection.query("SELECT * FROM products WHERE item_id=?",[input.idSelection.trim()], function(error, response){
            if (error) throw error; 
            if(response.length === 0){
                console.log('That product id did not exist');
            }
            var item = response[0];
            //we at least valid product
            if(item.stock_quantity >= input.quantitySelection){
                //we have a valid sale
                //DO real stuff
                var newStockQuantity = item.stock_quantity - input.quantitySelection;
                connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [newStockQuantity,input.idSelection.trim()], function(error, response){
                    if (error) throw error; 
                    console.log("Successfully just sold" + item.price * input.quantitySelection)
                });
            }
            else {
                //invlaid sale
                console.log('Not enough stock to sell that amount.')
            }
        
        });
    }).catch(function(err){
        console.log(err);
    });
}



