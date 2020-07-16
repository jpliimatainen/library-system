const jwt = require('jsonwebtoken');

const { secret } = require('../config/env.config');

module.exports = {

    validateToken: (req, res, next) => {
        let token = req.headers['authorization'] || null;
        
        if (token && token.startsWith('Bearer ')) {
            // Remove 'Bearer ' from the string
            token = token.slice(7, token.length);

            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ success: false, message: 'Authentication token is not valid!'})
                }
                req.decoded = decoded;
                next();
            });
        }
        else {
            return res.status(403).json({ success: false, message: 'Authentication token is not supplided!'})
        }
    }
};