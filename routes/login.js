// routes/login.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {
    router.get('/login', (req, res) => {
        const emailError = req.session.emailError;
        const passwordError = req.session.passwordError;
        const email = req.session.email || '';
        req.session.emailError = null; // Clear the error message
        req.session.passwordError = null; // Clear the error message
        req.session.email = null; // Clear the email
        res.render('login', { emailError, passwordError, email, title: 'LOGIN' });
    });

    router.post('/login', (req, res) => {
        const { email, password } = req.body;
        req.session.email = email; 
        if (email && password) {
            db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if (results.length > 0) {
                    bcrypt.compare(password, results[0].password, (err, result) => {
                        if (result) {
                            req.session.loggedin = true;
                            req.session.email = email;
                            req.session.id = results[0].id;
                            req.session.username = results[0].username;
                            req.session.score = results[0].score; // Store the score in session
                            res.redirect('/');
                        } else {
                            // Incorrect password
                            req.session.passwordError = 'Incorrect Password!';
                            res.redirect('/login');
                        }
                    });
                } else {
                    // No user found with given email
                    req.session.emailError = 'Incorrect Email!';
                    res.redirect('/login');
                }
            });
        } else {
            // Email or password not provided
            req.session.emailError = 'Please enter Email!';
            req.session.passwordError = 'Please enter Password!';
            res.redirect('/login');
        }
    });

    router.get('/logout', (req, res) => {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/login');
                }
            });
        }
    });

    return router;
};
