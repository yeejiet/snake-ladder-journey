module.exports = function(db) {
    var express = require('express');
    var router = express.Router();

    router.get('/getRandomQuestions', function(req, res) {
        console.log('Fetching questions for userId:', req.session.userId); // Debug statement
    
        db.query("SELECT * FROM questions ORDER BY RAND() LIMIT 1", function(err, results) {
            if (err) {
                console.error('Error fetching questions:', err);
                return res.status(500).json({ error: 'Failed to fetch questions' });
            }
            res.json(results);
        });
    });
    
    router.post('/submitAnswers', function(req, res) {
        const answers = req.body;
        const userId = req.session.userId;
    
        if (!userId) {
            console.log('User not logged in or session not set.'); // Debug statement
            return res.status(401).json({ error: 'User not logged in' });
        }
        
        console.log('Received answers from userId:', userId); // Debug statement
    
        let results = [];
        let totalScoreIncrement = 0;
    
        const checkAnswersPromises = answers.map((answer) => {
            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM questions WHERE id = ?', [answer.questionId], (err, queryResults) => {
                    if (err) {
                        console.error('Error fetching question:', err);
                        return reject(err);
                    }
    
                    const question = queryResults[0];
                    const correctAnswer = question.correct_answer.toString();
                    const givenAnswer = answer.answer.toString();
                    const isCorrect = (correctAnswer === givenAnswer);
    
                    results.push({ questionId: answer.questionId, isCorrect });
    
                    if (isCorrect) {
                        // Increment total score based on the question's score
                        totalScoreIncrement += question.score;
                    }
    
                    resolve();
                });
            });
        });
    
        Promise.all(checkAnswersPromises)
            .then(() => {
                if (totalScoreIncrement > 0) {
                    // Update user's score in the database
                    db.query('UPDATE users SET score = score + ? WHERE id = ?', [totalScoreIncrement, userId], (err) => {
                        if (err) {
                            console.error('Error updating user score:', err);
                            return res.status(500).json({ error: 'Failed to update user score' });
                        }
    
                        // Update the score in the session
                        req.session.score += totalScoreIncrement;
                        console.log('Updated session userId:', req.session.userId, 'New score:', req.session.score); // Debug statement
    
                        // Return updated score along with results
                        res.json({ results: results, updatedScore: req.session.score });
                    });
                } else {
                    res.json({ results: results, updatedScore: req.session.score });
                }
            })
            .catch((err) => {
                console.error('Error processing answers:', err);
                res.status(500).json({ error: 'Failed to process answers' });
            });
    });
    
    
    

    return router;
};
