# :smile_cat: Welcome to Whisker's Whimsies :smile_cat:

## The One-Stop Shop for all of your Cat's Needs!

### About this project:
Whisker's Whimsies is an Amazon-like, Command Line Interface (CLI) storefront for cat products using SQL database that has three different views: customer view, manager view, and supervisor view. Each view adds progressively higher levels of editability to the inventory of the store. 

## ![Demo](WhiskersWhimsiesDemo.gif)


### Customer View

* When viewing as a customer, all available products will display on the command line

* The customer can enter the ID of product to select it for purchase, then enter the quantity to place an order

* The total price will display in the command line, and the 'products' database will update quantities and product sales accordingly



### Manager View

* When viewing as a manager, a list of management actions will display:

    * **View Products for Sale**
        * lists every available item from 'products' table available for purchase: the items' IDs, names, departments, prices, and quantities display in a CLI-Table

    * **View Low Inventory**
        * lists all items with an inventory count lower than five: the items' IDs, names, departments, prices, and quantities display in a CLI-Table

    * **Add to Inventory**
        * prompts manager to enter an item's ID to select it, the allows the manager to add to the quantity of the item. A CLI-Table of all the items and their associated information is displayed again for the manager's reference, including the updated item

    * **Add New Product**
        * prompts manager to enter the name, price, department, and quantity for a new item, then creates a completely new item from the input to add to the inventory



### Supervisor View

When viewing as a supervisor, exlusive options are listed to allow user to compare sales to overhead costs, thereby determing total profits, as well as create a new department for managers to add items into:

* Loading supervisor view will display a list of management action options:

    * **View Products Sales by Department**
        * displays a styled table to the command line that utilizes the "RIGHT JOIN" method to compare information from the 'products' table and the 'departments' table
        * shows department ID, department name, overhead costs, sum of product sales by department, and total profits based on overhead costs and product sales

    * **Add New Department**
        * prompts supervisor to enter a name and the estimated overhead costs for a new department; the new department is added to the 'departments' SQL table and updated table is displayed on the console for the supervisor's reference

### Select code snippet to demonstrate the use of the 'Inquirer' and 'MySQL' Node Modules to create a new department from the supervisor view
``` javascript
function createNewDepartment() {
    inquirer.prompt([
        {
            name: "department",
            message: "Enter the name of the new department: ",
        },
        {
            name: "overhead",
            message: "Enter the department's overhead costs: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        connection.query("INSERT INTO departments SET ?",
            {
                department_name: answers.department,
                over_head_costs: answers.overhead,
            },
            function (err, res) {
                console.log("You have successfully added department " + answers.department + " to the list for inventory.");
                displaySupervisorOptions();
            }
        );
    });
}
```

Note: To run this app, you will need to install the depencies listed in the package.json, or type 'npm i' into your bash terminal

Thank you for reading!

### Built With:
* Command Line
* JavaScript
* MySQL
* Node.js
* CLI-Table
* Inquirer