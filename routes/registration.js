const express = require('express');
const router = express.Router();

module.exports = (db) => {
    /* GET registration page. */
    router.get('/registration', function(req, res) {
        res.render('registration', { title: 'REGISTRATION' });
    });

    router.post('/register', (req, res) => {
        const { username, email, password } = req.body;
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, password], (err, results) => {
            if (err) throw err;
            res.redirect('/handbook');
        });
    });
    return router;
};
