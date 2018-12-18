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
            head: ["Item ID", "Product", "Department", "Price", "Number in Stock"],
            colWidths: [10, 30, 30, 20, 20]
        });
        // Check for errors
        if (err) throw err;
        // If no errors... iterate through the items in the products table
        res.forEach(function (row) {
            // Push all items from the 'products' table into the CLI-Table
            table.push([row.id, row.product_name, row.department_name, row.price, row.stock_quantity]);
        })
        // Log Table to the command line for 'shoppers' to see what products they can purchase
        console.log(table.toString());
        // Invoke function to allow customers to begin shopping
        beginShopping();
    });

}

// Add function to prompt users about what and how many items they would like to purchase
function beginShopping() {
    // Prompt user for item ID and quantity - default type in Inquirer is 'input' so no need to specify 'type' explicitly
    inquirer.prompt([
        {
            name: "id",
            message: "Please enter the ID number of the item you'd like to purchase: ",
            validate: function (value) { // Verify that input is a number
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            message: "Please enter the quantity you'd like to purchase: ",
            validate: function (value) { // Verify that input is a number
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        // Create a new connection to the SQL database to compare the ID and stock quantity of the item - prevent injection
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
                // Otherwise, 'fullfill' the order
                else {
                    // Invoke function to 'fullfill' order, passing the answers from the prompt and values from the SQL database
                    fulfillOrder(answers.id, answers.quantity, res[0].product_name, res[0].stock_quantity);
                }
            });
    });
}

// Add function to 'fullfill' user's order by updating database
function fulfillOrder(id_desired, quantity_desired, product_name, quantity_stock) {
    // Connect to products table to set values - prevent injection
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {   // Reassign stock_quantity to the original amount minus the number ordered by the user
                stock_quantity: (quantity_stock - quantity_desired)
            },
            {   // At the id equal to the id chosen by the user in the beginShopping prompt
                id: id_desired
            }
        ],
        function (err, res) {
            // Check for errors
            if (err) throw err;
            // If no errors...
            // Log the number of items 'purhcased' to the customer
            console.log("You have successfully placed an order for " + quantity_desired + " of item: " + product_name);
        }
    );
    // Connect to products table to get values and calculate total cost to user - prevent injection
    connection.query("SELECT * FROM products WHERE ?", { id: id_desired },
        function (err, res) {
            // Check for errors
            if (err) throw err;
            // If no errors...
            // Assign a variable to calculate the user's total cost
            var total = res[0].price * quantity_desired;
            // Assign variable to display total to 2 decimal places even if the values at those decimal places are 0
            var totalDisplay = total.toFixed(2);
            // Log the total cost to the user
            console.log("Your total is: " + totalDisplay);
            // Connect to products table to update product_sales based on item and quantity user 'purchased' - prevent injection
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {   // Reassign product_sales to the previous value plus the user's total
                        product_sales: (res[0].product_sales + total)
                    },
                    {   // At the id equal to the id chosen by the user in the beginShopping prompt
                        id: id_desired
                    }
                ],
                function (err, res) {
                    // Check for errors
                    if (err) throw err;
                    // If no errors...
                    // Prompt the user to ask if they'd like to place another order, or end their session
                    inquirer.prompt(
                        {
                            type: "confirm",
                            name: "confirm",
                            message: "Would you like to make another purchase?"
                        }
                    ).then(function (answer) {
                        // If the user confirms 'yes', invoke the displayItems function after the connection is made to restart shopping
                        if (answer.confirm) {
                            displayItems();
                        }
                        // Otherwise, end the connection
                        else {
                            console.log("Thank you for shopping at Whisker's Whimsies! Have a great day!")
                            connection.end();
                        }
                    });
                }
            );
        }
    );
}