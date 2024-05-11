// Import the necessary dependencies
const express = require('express');
const mysql = require('mysql');

// Create an Express app
const app = express();

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: false }));

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shop_db'
});

// Route to get all products from the "products" table
app.get('/products', (req, res) => {
  // Query the database to retrieve all products
  pool.query('SELECT * FROM product', (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
      return;
    }

    // Check if there are any products in the database
    if (results.length === 0) {
      res.status(404).send({ message: 'No products found' });
      return;
    }

    // Send the products back to the client
    res.json(results);
  });
});

// Route to get a product by ID from the "products" table
app.get('/products/:id', (req, res) => {
  // Get the product ID from the request parameters
  const id = req.params.id;

  // Query the database to retrieve the product
  pool.query('SELECT * FROM product WHERE id = ?', id, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
      return;
    }

    // Check if the product exists
    if (results.length === 0) {
      res.status(404).send({ message: 'Product not found' });
      return;
    }

    // Send the product back to the client
    res.json(results[0]);
  });
});

// Route to create a new product in the "products" table
app.post('/products', (req, res) => {
  // Get the product data from the request body
  const product = req.body;

  // Query the database to insert the new product
  pool.query('INSERT INTO product SET ?', product, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
      return;
    }

    // Send the newly created product back to the client
    res.json(result);
  });
});

// Route to update a product in the "products" table
app.put('/products/:id', (req, res) => {
  // Get the product ID from the request parameters
  const id = req.params.id;

  // Get the product data from the request body
  const product = req.body;

  // Query the database to update the product
  pool.query('UPDATE product SET ? WHERE id = ?', [product, id], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
      return;
    }

    // Send the updated product back to the client
    res.json(result);
  });
});

// Route to delete a product from the "products" table
app.delete('/products/:id', (req, res) => {
  // Get the product ID from the request parameters
  const id = req.params.id;

  // Query the database to delete the product
  pool.query('DELETE FROM product WHERE id = ?', id, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
      return;
    }

    // Send a success message back to the client
    res.json({ message: 'Product deleted successfully' });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});