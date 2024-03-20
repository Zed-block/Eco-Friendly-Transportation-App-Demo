// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Dummy database (replace with a real database like MongoDB or PostgreSQL)
let users = [];

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ error: "Username already exists" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add user to the database
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = users.find((user) => user.username === username);

  // Check if user exists
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  try {
    // Compare hashed password with input password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
