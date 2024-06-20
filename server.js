// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const { User } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route to handle signup form submission
app.post('/signup', async (req, res) => {
    const {
        firstName, lastName, email, password, orgName, phone, industry, website,
        address, address2, city, state, zip, country, accountType
    } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const passwordHash = bcrypt.hashSync(password, 10);

        // Create new user
        const newUser = await User.create({
            firstName, lastName, email, passwordHash, orgName, phone, industry,
            website, address, address2, city, state, zip, country, accountType
        });

        res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Handle login form submission
const jwt = require('jsonwebtoken'); // Assuming you're using JWT for token generation

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (user && bcrypt.compareSync(password, user.passwordHash)) {
            // Password is correct
            const token = jwt.sign({ email }, 'secretKey', { expiresIn: '1h' });
            res.json({ message: 'Login successful', token ,user: user});
        } else {
            // Email not found or password incorrect
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
