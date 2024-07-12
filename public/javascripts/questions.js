$(document).ready(function() {
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    $.ajax({
        url: '/getRandomQuestions',
        method: 'GET',
        success: function(questions) {
            var questionsList = $('#questions-list');
            questionsList.empty(); // Clear any previous questions
            questions.forEach(function(question) {
                let answers = [
                    { text: question.correct_answer, isCorrect: true },
                    { text: question.answer_option_2, isCorrect: false },
                    { text: question.answer_option_3, isCorrect: false },
                    { text: question.answer_option_4, isCorrect: false }
                ];
                
                answers = shuffle(answers);

                var questionHtml = `
                    <div class="card mb-3">
                        <div class="card-body" style="background-color: #d1e4d1;">
                            <h5 class="card-title">${question.question}</h5>
                            ${answers.map((answer, index) => `
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="radio" name="question${question.id}" id="answer${question.id}_${index + 1}" value="${answer.text}">
                                    <label class="form-check-label" for="answer${question.id}_${index + 1}">
                                        ${answer.text}
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                questionsList.append(questionHtml);
            });
        },
        error: function(err) {
            console.error('Error fetching questions:', err);
        }
    });

    $('#questions-form').on('submit', function(event) {
        event.preventDefault();
        var formData = $(this).serializeArray();
        console.log(formData);
        // You can now send formData to the server for validation and scoring
    });
});
