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
    // Invoke the displayManagerOptions function after the connection is made to start managing the items in the store
    displayManagerOptions();
});

// Add function to prompt user with management actions - switch on response to invoke relevant functions
function displayManagerOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Management Options:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
        }
    ]).then(function (res) {
        switch (res.choice) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "EXIT":
                console.log("Goodbye...");
                connection.end();
                break;
        }
    });
}

// Add function to view all products as a 'manager'
function viewProducts() {
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
        // Log Table to the command line for 'manager' to see what products and quantities are available for purchase
        console.log(table.toString());
        // Re-Invoke 'manager' options function to allow 'manager' to continue viewing/making changes to inventory
        displayManagerOptions();
    });

}