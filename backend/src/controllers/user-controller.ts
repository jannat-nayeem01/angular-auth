import express from 'express';

const userController = express.Router(); // Use Router to create a router

// Routes
userController.post('/api/register', registerRoute);

function registerRoute(req, res) {
  // Implement user registration logic here
  // Example: Parse user registration data from the request and save it to the database
  const userData = req.body; // Assuming user data is sent in the request body

  // Your registration logic here, e.g., saving the user to the database

  res.status(200).json({ message: 'User registered successfully' });
}

export { userController };
