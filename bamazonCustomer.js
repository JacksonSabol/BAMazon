// Import Node Modules for MySQL, Inquirer, and CLI-Table
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// Create the connection information for the SQL database
var connection = mysql.createConnection({
    host: "localhost",
    // Assign the port to be used by localhost
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "password",
    // Database name to be used
    database: "bamazon"
});

// Connect to the MySQL server and SQL database
connection.connect(function (err) {
    if (err) throw err;
    // Invoke the displayItems function after the connection is made to start shopping
    displayItems();
});

// Add function to display the items available for purchase at Whisker's Whimsies
function displayItems() {
    // Select all items available for purchase from the 'products' table
    connection.query("SELECT * FROM products", function (err, res) {
        // Assign a variable to create a new CLI-Table
        var table = new Table({
            head: ["ID", "Product", "Department", "Price", "Number in Stock"],
            colWidths: [10, 30, 30, 20, 20]
        });
        // Check for errors
        if (err) throw err;
        // If no errors...
        res.forEach(function (row) {
            // Push all items from the 'products' table into the CLI-Table
            table.push([row.id, row.product_name, row.department_name, row.price, row.stock_quantity]);
        })
        // Log Table to the command line for 'shoppers' to see what products they can purchase
        console.log(table.toString());
        // Invoke function to allow customers to begin shopping
        beginShopping();
        // End connection for testing
        // connection.end();
    });

}

// Add function to prompt users about what and how many items they would like to purchase
function beginShopping() {
    // Prompt user for item ID and quantity - default type in Inquirer is 'input' so no need to specify 'type' explicitly
    inquirer.prompt([
        {
            name: "id",
            message: "Please enter the ID number of the item you'd like to purchase",
            validate: function (value) { // Verify that input is a number
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            message: "Please enter the quantity you'd like to purchase",
            validate: function (value) { // Verify that input is a number
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        // Create a new connection to the SQL database to compare the ID and stock quantity of the item
        connection.query("SELECT * FROM products WHERE ?", { id: answers.id },
            function (err, res) {
                // Check for errors
                if (err) throw err;
                // If no errors...
                // Check if the quantity allows for the users request to purchase - if it doesn't...
                if (answers.quantity > res[0].stock_quantity) {
                    // Log Insufficient Quantity to user
                    console.log("Insufficient Quantity!\nPlease check available quantity and try again.");
                    // Re-invoke the beginShopping function to show prompt again
                    beginShopping();
                }
                // Otherwise, fullfill the order
                else {
                    // Invoke function to fullfill order, passing the answers from the prompt
                    //
                    // Log for testing
                    console.log(answers.id, answers.quantity, res[0].product_name, res[0].department_name, res[0].price, res[0].stock_quantity);
                    // End connection for testing
                    connection.end();
                }
            });
    });
}