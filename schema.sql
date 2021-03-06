DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  id INTEGER(10) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL (10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  product_sales DECIMAL (10,2),
  PRIMARY KEY (id)
);

CREATE TABLE departments (
  id INTEGER(10) NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(50) NOT NULL,
  over_head_costs DECIMAL (10,2) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products 
  (product_name, department_name, price, stock_quantity)
VALUES
  ("Can of Turkey Pâté", "Cat Food", 1.79, 100),
  ("Grain-Free Dry Food", "Cat Food", 11.95, 50),
  ("Scratching Post", "Cat Toys", 19.99, 20),
  ("Feather Wand", "Cat Toys", 4.99, 15),
  ("Harness", "Cat Accessories", 3.49, 5),
  ("Flea Collar", "Cat Health", 57.00, 20),
  ("Brush", "Cat Health", 5.99, 25),
  ("Litter Box", "Cat Essentials", 19.95, 12),
  ("Ceramic Food Bowl", "Cat Essentials", 7.49, 20),
  ("Cat Tree", "Cat Toys", 119.95, 5),
  ("Water Fountain", "Cat Accessories", 29.99, 9);

INSERT INTO departments 
  (department_name, over_head_costs)
VALUES
  ("Cat Food", 500),
  ("Cat Toys", 1000),
  ("Cat Accessories", 700),
  ("Cat Health", 400),
  ("Cat Essentials", 300);

SELECT * FROM products;
SELECT * FROM departments;