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

// Add function to view overhead costs, product sales, and total profits for each departments
function viewProductSales() {
    // Assign variable to select from the relevant columns and combin product_sales by department
    var query = "SELECT departments.id, departments.department_name, departments.over_head_costs, SUM(products.product_sales)";
    // Add to query variable to join 'products' and 'departments' tables by department_name
    query += "FROM products RIGHT JOIN departments ON products.department_name = departments.department_name ";
    // Add to query variable to group by the 'departments' id and the 'products' department_name
    query += "GROUP BY departments.id, products.department_name";
    // Connect to the database using the variable 'query'
    connection.query(query, function (err, res) {
        // Assign a variable to create a new CLI-Table
        var table = new Table({
            head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
            colWidths: [20, 30, 20, 20, 20]
        });
        // Check for errors
        if (err) throw err;
        // If no errors...
        // Iterate through the items in the joined tables
        res.forEach(function (row) {
            // Default value of product_sales when column is created in MySQL Workbench is 'null'
            // So if there haven't been any sales yet, change null to 0 to display correctly in CLI-Table
            if (row['SUM(products.product_sales)'] === null) {
                row['SUM(products.product_sales)'] = 0;
            }
            // Assign variable to calculate the total profit - sum of product_sales in each row of 'products' table minus the overhead costs in each row
            var totalProfit = (row['SUM(products.product_sales)'] - row.over_head_costs);
            // Assign variable to display total to 2 decimal places even if the values at those decimal places are 0
            var totalDisplay = totalProfit.toFixed(2);
            // Push the item and department information, as well as the totalProfit calculation, to the new CLI-Table
            table.push([row.id, row.department_name, row.over_head_costs, row['SUM(products.product_sales)'], totalDisplay]);

        });
        // Log the table of product sales by department to the 'supervisor'
        console.log(table.toString());
        // Invoke the displaySupervisorOptions function to present user with management action options
        displaySupervisorOptions();
    });
}

// Add function to create a new department in the departments table
function createNewDepartment() {
    // Prompt user for item ID and quantity - default type in Inquirer is 'input' so no need to specify 'type' explicitly
    inquirer.prompt([
        {
            name: "department",
            message: "Enter the name of the new department: ",
        },
        {
            name: "overhead",
            message: "Enter the department's overhead costs: ",
            validate: function (value) { // Verify that input is a number
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        // Create a new connection to the SQL database to insert the new department information - prevent injection
        connection.query("INSERT INTO departments SET ?",
            {
                department_name: answers.department,
                over_head_costs: answers.overhead,
            },
            function (err, res) {
                // Check for errors
                if (err) throw err;
                // If no errors...
                // Log that the department was successfully 'added' by the 'supervisor'
                console.log("You have successfully added department " + answers.department + " to the list for inventory.");
                // Re-Invoke the displaySupervisorOptions function to present user with management action options
                displaySupervisorOptions();
            }
        );
    });
}