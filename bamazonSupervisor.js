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
    displaySupervisorOptions();
});

// Add function to prompt user with supervisor actions - switch on response to invoke relevant functions
function displaySupervisorOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Supervisor Options: ",
            choices: ["View Product Sales by Department", "Create New Department", "EXIT"]
        }
    ]).then(function (res) {
        switch (res.choice) {
            case "View Product Sales by Department":
                viewProductSales();
                break;
            case "Create New Department":
                createNewDepartment();
                break;
            case "EXIT":
                console.log("Goodbye...");
                connection.end();
                break;
        }
    });
}