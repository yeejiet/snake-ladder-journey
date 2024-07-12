// routes/questions.js
module.exports = function(db) {
    var express = require('express');
    var router = express.Router();
    
    router.get('/getRandomQuestions', function(req, res) {
        db.query("SELECT * FROM questions ORDER BY RAND() LIMIT 1", function (err, results) {
            if (err) {
                console.error('Error fetching questions:', err);
                return res.status(500).json({ error: 'Failed to fetch questions' });
            }
            res.json(results);
        });
    });

    return router;
};
