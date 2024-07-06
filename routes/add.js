const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.post('/register', (req, res) => {
        const { username, email, password } = req.body;
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, password], (err, results) => {
            if (err) throw err;
            res.redirect('/login');
        });
    });
    return router;
};
