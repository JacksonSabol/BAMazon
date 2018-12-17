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
        if (err) {
            throw err;
        }
        // If no errors...
        else {
            res.forEach(function (row) {
                // Push all items from the 'products' table into the CLI-Table
                table.push([row.id, row.product_name, row.department_name, row.price, row.stock_quantity]);
            })
            // Log Table to the command line for 'shoppers' to see what products they can purchase
            console.log(table.toString());
            // Invoke function to allow customers to begin shopping
            // 
            
            // End connection for testing
            connection.end();
        }
    });

}