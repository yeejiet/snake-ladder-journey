// routes/index.js
var express = require('express');
var router = express.Router();

module.exports = (db, checkLoggedIn) => {
  // Define the route for GET /
  router.get('/', checkLoggedIn, (req, res) => {
    const query = "SELECT * FROM users";

    // Execute the query
    db.query(query, (err, result) => {
      if (err) {
        // Handle the error properly
        console.error('Database query error:', err);
        return res.status(500).send('Internal Server Error');
      }

      // Render the 'index' view with the query results and session data
      res.render('index', { 
        title: 'Snake and Ladder Journey', 
        users: result, 
        username: req.session.username, 
        score: req.session.score 
      });
    });
  });

  return router;
};
