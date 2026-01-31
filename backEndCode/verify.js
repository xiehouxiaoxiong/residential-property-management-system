const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const config = require('./config')

function verifyToken(req, res, next) {
    const token = req.headers['authorization']; 
    if (!token) return res.status(401).send('Access Denied!');

    jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token.');

        
        req.user = decoded;
        next();
    });
}

module.exports.verifyToken =verifyToken