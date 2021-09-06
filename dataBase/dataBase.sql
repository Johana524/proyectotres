CREATE DATABASE IF NOT EXISTS delilahresto DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE delilahresto;

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  order_id int(11) NOT NULL,
  orderTime timestamp NOT NULL DEFAULT current_timestamp(),
  orderStatus enum('new','confirmed','cooking', 'sending','canceled','delivered') DEFAULT 'new',
  orderDescription varchar(255) NOT NULL,
  orderPayment enum('cash','card') DEFAULT NULL,
  orderTotal double(5,2) NOT NULL,
  order_user_id int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS order_detail;
CREATE TABLE order_detail(
 order_id int(11) NOT NULL,
 product_id int(11) NOT NULL,
 quantity int(11) DEFAULT NULL
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS products;
CREATE TABLE products(
 product_id int(11) NOT NULL,
 productName varchar(255) NOT NULL,
 productPrice float(4,2) NOT NULL,
 productDescription varchar(255) NOT NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts(
 user_id int(11) NOT NULL,
 userCompleteName varchar(255) NOT NULL,
 userEmail varchar(255) NOT NULL,
 userPhone bigint(11) NOT NULL,
 userAddress varchar(255) NOT NULL,
 userPassword varchar(255) NOT NULL,
 userActive tinyint(1) NOT NULL DEFAULT 0,
 userAdmin tinyint(1) NOT NULL DEFAULT 0
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

 ALTER TABLE orders
 ADD PRIMARY KEY (order_id);
 
ALTER TABLE products
ADD PRIMARY KEY (product_id);

ALTER TABLE accounts
ADD PRIMARY KEY (user_id);

ALTER TABLE orders
MODIFY order_id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

ALTER TABLE products
MODIFY product_id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE accounts
MODIFY user_id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

ALTER TABLE orders
  ADD CONSTRAINT fk_orders_accounts FOREIGN KEY (order_user_id) REFERENCES accounts (user_id) ON DELETE CASCADE;

ALTER TABLE order_detail
  ADD CONSTRAINT fk_order_detail_orders FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_order_detail_products FOREIGN KEY (product_id) REFERENCES products (product_id);

