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

// Add function to list all items with an inventory count lower than five.
function viewLowInventory() {
    // Connect to the database and select all items available for purchase from the 'products' table
    connection.query("SELECT * FROM products",
        function (err, res) {
            // Assign a variable to create a new CLI-Table
            var table = new Table({
                head: ["ID", "Product", "Department", "Price", "Number in Stock"],
                colWidths: [10, 30, 30, 20, 20]
            });
            // Check for errors
            if (err) throw err;
            // If no errors...
            // Assign variable to track whether there are any items with low inventory
            var counter = 0;
            // Iterate through the items in the products table
            res.forEach(function (row) {
                // Check if the quantity in stock of any item is less than 5
                if (row.stock_quantity < 5) {
                    // If it is, increment the low inventory counter
                    counter++;
                    // Push all items with low inventory to CLI-Table
                    table.push([row.id, row.product_name, row.department_name, row.price, row.stock_quantity]);
                }
                // Else, do nothing, because we're only concerned with items having a low inventory 
            })
            // Check whether the low inventory counter is equal to 0
            // If it is...
            if (counter === 0) {
                // Inventory levels are good
                console.log("You're well stocked!");
                // Re-Invoke viewProducts to display inventory which then invokes the displayManagerOptions function to present user with management action options
                viewProducts();
            }
            // Otherwise...
            else {
                // Log the table of items with low inventory to the 'manager'
                console.log(table.toString());
                // Invoke the displayManagerOptions function to present user with management action options
                displayManagerOptions();
            }
        });
}

// Add function to allow 'manager' to add more of any item currently in the store
function addToInventory() {
    // Prompt user for item ID and quantity - default type in Inquirer is 'input' so no need to specify 'type' explicitly
    inquirer.prompt([
        {
            name: "id",
            message: "Enter the ID of the item to which you'd like to add inventory: ",
            validate: function (value) { // Verify that input is a number
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            message: "Enter the quantity you'd like to add to this item's inventory: ",
            validate: function (value) { // Verify that input is a number
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        // Create a new connection to the SQL database to get the product information about the item at the user's requested ID - prevent injection
        connection.query("SELECT * FROM products WHERE ?", { id: answers.id },
            function (err, res) {
                // Check for errors
                if (err) throw err;
                // If no errors...
                // Assign local variable to hold the product name for displaying later
                var productName = res[0].product_name;
                // Initiate another connection to update the database at the user specified ID - prevent injection
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {   // Reassign stock_quantity to the original amount plus the user specified amount
                            stock_quantity: (res[0].stock_quantity + parseInt(answers.quantity))
                        },
                        {   // At the id equal to the id chosen by the user in the previous prompt
                            id: answers.id
                        }
                    ],
                    function (err, res) {
                        // Check for errors
                        if (err) throw err;
                        // If no errors...
                        // Log the number of items 'added' by the 'manager'
                        console.log("You have successfully added " + answers.quantity + " of item: " + productName);
                        // Re-Invoke viewProducts to display updated inventory which then invokes the displayManagerOptions function to present user with management action options
                        viewProducts();
                    }
                );

            }
        );
    });
}