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

    router.post('/submitAnswers', function(req, res) {
        const answers = req.body;
        console.log('Received answers:', answers);

        let results = [];

        answers.forEach(answer => {
            db.query('SELECT * FROM questions WHERE id = ?', [answer.questionId], (err, queryResults) => {
                if (err) {
                    console.error('Error fetching question:', err);
                    return res.status(500).json({ error: 'Failed to fetch question' });
                }

                const question = queryResults[0];
                console.log('Question:', question);

                const correctAnswer = question.correct_answer.toString();
                const givenAnswer = answer.answer.toString();

                const isCorrect = (correctAnswer === givenAnswer);
                results.push({ questionId: answer.questionId, isCorrect });
            });
        });

        setTimeout(() => {
            console.log('Results:', results);
            res.json({ results: results });
        }, 1000); // Delay added to ensure all queries are processed
    });

    return router;
};
