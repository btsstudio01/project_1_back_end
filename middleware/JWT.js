const jwt = require('jsonwebtoken');
// Mock user data for demonstration purposes
const users = [
    { id: 1, username: 'john', password: 'password123' },
    { id: 2, username: 'jane', password: 'password456' },
];

// Secret key for signing and verifying JWTs
const secretKey = '121212';

// Middleware to verify JWT on protected routes
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'Token not provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
}

function generateToken(user) {
    return jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
}

function authenticateUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

function generateRefreshToken(user) {
    return jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '7d' });
}

function refreshToken(refreshToken) {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, secretKey, (err, decoded) => {
        if (err) {
          reject({ status: 401, message: 'Invalid refresh token' });
        } else {
          const user = users.find(u => u.id === decoded.userId);
  
          if (user) {
            const newToken = generateToken(user);
            resolve({ token: newToken });
          } else {
            reject({ status: 401, message: 'User not found' });
          }
        }
      });
    });
  }

module.exports = { verifyToken, generateToken, authenticateUser, generateRefreshToken, refreshToken };
