const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { verifyToken, generateToken, authenticateUser, generateRefreshToken, refreshToken } = require('./middleware/JWT');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Route for user login and JWT generation
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = authenticateUser(username, password);

    if (user) {
        // Generate and send JWT and refresh token upon successful login
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ token, refreshToken });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.post('/refreshToken', (req, res) => {
    const { refreshToken : newToken } = req.body;

    refreshToken(newToken)
    .then(result => res.json(result))
    .catch(error => res.status(error.status).json({ message: error.message }));
});

// Your routes and JWT functionality will be added here

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});