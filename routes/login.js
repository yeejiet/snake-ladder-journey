const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/login', (req, res) => {
        const emailError = req.session.emailError;
        const passwordError = req.session.passwordError;
        const email = req.session.email || '';
        req.session.emailError = null; // Clear the error message
        req.session.passwordError = null; // Clear the error message
        req.session.email = null; // Clear the email
        res.render('login', { emailError, passwordError, email, title:'LOGIN' });
    });

    router.post('/login', (req, res) => {
        const { email, password } = req.body;
        req.session.email = email; // Store the email in session
        if (email && password) {
            db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.email = email;
                    req.session.id = results[0].id;
                    req.session.username = results[0].username;
                    res.redirect('/handbook');
                   
                } else {
                    req.session.emailError = 'Incorrect Email and Password!';
                    res.redirect('/login');
                }
            });
        } else {
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