const scanner = new Html5QrcodeScanner('reader', {
  qrbox: {
      width: 250,
      height: 250,
  },
  fps: 10,
});

let lastScanTime = 0;
const scanThrottle = 30000; // 1 second throttle time

scanner.render(success, error);

function success(result) {
  const currentTime = new Date().getTime();
  if (currentTime - lastScanTime < scanThrottle) {
      return; // Ignore if called too soon
  }
  lastScanTime = currentTime;

  try {
      const data = JSON.parse(result);
      const answers = [
          data.correct_answer,
          data.answer_option_2,
          data.answer_option_3,
          data.answer_option_4
      ];

      // Shuffle the answers
      const shuffledAnswers = shuffleArray(answers);

      // Display the question and answer options
      document.getElementById('result').innerHTML = `
          <p class="text-center"><strong>Question:</strong> ${data.question}</p>
          <form id="answer-form">
              ${shuffledAnswers.map((answer, index) => `
                  <div>
                      <input type="radio" id="option${index}" name="answer" value="${answer}">
                      <label for="option${index}">${answer}</label>
                  </div>
              `).join('')}
              <button class="custom-btn justify-content-center btn mb-3" type="button" onclick="submitAnswer(${data.id}, '${data.correct_answer}')">Submit Answer</button>
          </form>
      `;

      // Hide QR scanner and show result
      document.getElementById('reader').style.display = 'none';
      document.getElementById('result').style.display = 'block';

  } catch (err) {
      console.error("Error parsing QR code data:", err);
  }
}

function error(err) {
  console.error(err);
}

function submitAnswer(questionId, correctAnswer) {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  const resultElement = document.getElementById('result');

  if (selectedAnswer) {
      const userAnswer = selectedAnswer.value;
      let scoreUpdate = 0;

      if (userAnswer === correctAnswer) {
          resultElement.innerHTML += `
              <img src="/images/happy.gif" alt="Happy" style="width: 100px;">
              <p class="mt-3">Congratulations! You got the correct answer!</p>
          `;
          scoreUpdate = 10; // or any other score value for a correct answer
      } else {
          resultElement.innerHTML += `
              <img src="/images/sad.gif" alt="Sad" style="width: 100px;">
              <p class="mt-3">Oopsy! Try again next time!</p>
          `;
      }

      // Send the score update to the server
      fetch('/submitAnswers', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify([{
              questionId: questionId,
              answer: userAnswer
          }]),
      })
      .then(response => response.json())
      .then(data => {
          if (data.updatedScore !== undefined) {
              console.log('Score updated successfully:', data.updatedScore);
              // Optionally, update the displayed score
              document.getElementById('user-score').innerText = data.updatedScore;
              
              // Show QR scanner again after a delay or user action
              setTimeout(() => {
                  document.getElementById('result').style.display = 'none';
                  document.getElementById('reader').style.display = 'block';
                  scanner.render(success, error); // Reinitialize the scanner
              }, 3000); // 3 seconds delay or adjust as needed

          } else {
              console.error('Error updating score:', data.error);
          }
      })
      .catch(error => {
          console.error('Error:', error);
      });

  } else {
      alert('Please select an answer');
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
