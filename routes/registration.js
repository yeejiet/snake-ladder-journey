const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
    /* GET registration page. */
    router.get('/registration', function(req, res) {
        res.render('registration', { title: 'REGISTRATION' });
    });

    // Check username availability
    router.post('/checkUsername', (req, res) => {
        const { username } = req.body;
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], (err, results) => {
            if (err) throw err;
            res.json({ exists: results.length > 0 });
        });
    });

    // Check email availability
    router.post('/checkEmail', (req, res) => {
        const { email } = req.body;
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) throw err;
            res.json({ exists: results.length > 0 });
        });
    });

    router.post('/register', (req, res) => {
        const { username, email, password } = req.body;
        bcrypt.hash(password, 10, function(err, hash) {
            // Server-side validation
            if (!username || username.length < 1) {
                return res.render('registration', { title: 'REGISTRATION', errorMessage: 'Username must be at least 3 characters long.', field: 'username' });
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailPattern.test(email)) {
                return res.render('registration', { title: 'REGISTRATION', errorMessage: 'Please enter a valid email address.', field: 'email' });
            }
            const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!password || !passwordPattern.test(password)) {
                return res.render('registration', { title: 'REGISTRATION', errorMessage: 'Password must be at least 8 characters long, include at least one number, one uppercase letter, and one special character.', field: 'password' });
            }
    
            // Check if username or email already exists
            const checkUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
            db.query(checkUserQuery, [username, email, hash], (err, results) => {
                if (err) throw err;
    
                if (results.length > 0) {
                    return res.render('registration', { title: 'REGISTRATION', errorMessage: 'Username or email already exists.', field: 'username' });
                }
    
                // Insert new user into database
                const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
                db.query(insertUserQuery, [username, email, hash], (err, results) => {
                    if (err) throw err;
                    res.redirect('login');
                });
            });
        })

    });

    return router;
};
