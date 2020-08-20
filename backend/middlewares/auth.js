const jwt = require('jsonwebtoken');
const config = require('../config/db.config');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, config.keys.secret);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({ error: 'Vous n\'êtes pas authentifié et ne pouvez donc accéder à la base de données' });
    }
};