// login.js
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
        res.render('login', { emailError, passwordError, email, title:'LOGIN' });
    });

    router.post('/login', (req, res) => {
        const { email, password } = req.body;
        req.session.email = email; // Store the email in session
        if (email && password) {
            db.query('SELECT * FROM users WHERE email = ?', [email], (error, results, fields) => {
                if (results.length > 0) {
                    bcrypt.compare(password, results[0].password, function(err, result) {
                        if (result) {
                            req.session.loggedin = true;
                            req.session.userId = results[0].id; // Ensure userId is stored in session
                            req.session.email = email;
                            req.session.username = results[0].username;
                            req.session.score = results[0].score; // Store the score in session
                            
                            // Log the user ID and session user ID
                            console.log('User logged in with ID:', results[0].id);
                            console.log('Session userId:', req.session.userId);
            
                            res.redirect('/handbook');
                        } else {
                            req.session.passwordError = 'Incorrect Password!';
                            res.redirect('/login');
                        }
                    })
                } else {
                    req.session.emailError = 'Incorrect Email!';
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
