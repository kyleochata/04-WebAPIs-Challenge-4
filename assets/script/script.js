/*
First load the site; presented with the home page
- Home page:
  -Welcomes user to the quiz
  -Explain quiz rules
  - Explain how quiz score works
  -Start button
    -when start button is hit; timer starts and quiz starts
  -Header will have an link/button to view previous high scores
    -save highscores value of score and initials of who the score belongs to

-When the quiz is started
  -Question is shown at the top of the page;
  -multiple choice answers (only allow one to be picked);
  -button at end of answer choices
    -Next question btn: will proceed to the next question (will change to finish/submit button on the last question)
    -After user hits the next question button:
    if user gets a question wrong:
      -time is taken away from the timer
    -Show a question counter based on (question user is on) out of (total number of questions)
  -Quiz is over when user gets to the final question and answers
  -Quiz is over when timer hits 0
  -On game over: user can input their initials and save their final score;
    -score and initals must be saved and reloaded after quiz finishes; can be accessed with the view highscore button
*/
//variables
const timerEl = document.querySelector('#timer');
const mainEl = document.querySelector('#main');
const homeAEl = document.querySelector('#home-a');
const highScoreAEl = document.querySelector('#highscore-a');
const formEl = document.querySelector('#form')
//quiz variable sets
let currentQuestion = 0;
//ea click on next btn --> cQ++

const quizA = [
  {question: "What is a?",
  choices: ["true", "nul", ""],
  answer: "true",
}, {
  question: "hello",
  choices: ['b', 'c', 'a'],
  answer: 'b'
}
];

let initialsList = [];
let highScoreList = [];
//create a global variable to allow for clearIntervals to be accessed anywhere
let timeInterval;
//max time allowed for the quiz
var timeLeft = 30;
// highScoreAEl.addEventListener('click', showScores)

//when page loads for first time or when you click the home anchor in the header; run this fxn to display our home screen

const showTitle = (titleContent) => {
  var title = document.createElement('h1');
  title.textContent = titleContent;
  title.classList.add('home-title');
  mainEl.appendChild(title);
};

const showSubTitle = (subTitleContent) => {
  var subTitle = document.createElement('h2');
  subTitle.textContent = subTitleContent;
  subTitle.classList.add('sub-title');
  mainEl.appendChild(subTitle);
};

const showP = (paraContent) => {
  var pContent = document.createElement('p');
  pContent.textContent = paraContent;
  pContent.classList.add('home-para');
  mainEl.appendChild(pContent);
};

const startBtn = () => {
  var btnStart = document.createElement('button');
  btnStart.textContent = 'Start Quiz!';
  btnStart.setAttribute('id', 'home-start-btn');
  mainEl.appendChild(btnStart);
  btnStart.addEventListener('click', startQuiz);

};

const homepage = () => {

  mainEl.textContent = '';
  
  showTitle('Ready to take this challenge!?');

  showSubTitle('Read below to start!');

  showP('Rules: The quiz will begin when you hit the start button. The timer in the top right corner will keep track of the time remaining to complete the quiz. If you get a question wrong: 10 seconds will be subtracted from the timer as a penalty. If you finish all questions or the timer hits 0 seconds, the quiz is over!');

  showP('Score: the time remaining when you finish the quiz is equal to your score. Good Luck!');
  
  startBtn();

};

//function for timer; MISSING: deduct time if you get question wrong.
//highScoreList var = []
var timer = () => {

timeInterval = setInterval(function (){
    timeLeft--;
    timerEl.textContent = ' ' + timeLeft;
    let timeScore = timeLeft;

    if (timeLeft <= 0) {
      timerEl.textContent = 'Time up!';
      clearInterval(timeInterval);
      gameOver();
    } else if (timeLeft > 0 && currentQuestion == quizA.length) {
      let storedScores = JSON.parse(localStorage.getItem('highScore') || '[]');
        storedScores.push(timeScore);
        localStorage.setItem('highScore', JSON.stringify(storedScores));
        clearInterval(timeInterval);
        if (storedScores == null) {
          storedScores = initialsList;
          storedScores.push(timeScore);
          localStorage.setItem('highScore', JSON.stringify(storedScores));
        }
      }
return; 
  }, 1000);
};



//on start button generate first answer. have timer start.
//main -> label -> input x4 choices (answer choices) -> button to move to next question
var startQuiz = () => {
  mainEl.textContent = '';
  currentQuestion = 0;
  timer();
inQuiz();
};

var inQuiz = () => {
  mainEl.innerHTML = '';
  questionLabel();
  answerChoiceBtn();
}




//create question to be answered as a label.
var questionLabel = () => {
  var questionL = document.createElement('label'); //
  questionL.textContent = quizA[currentQuestion].question;
  questionL.classList.add('home-para');
  mainEl.appendChild(questionL);
};

//creating buttons for the user to pick. 
var answerChoiceBtn = () => {
  for (let i = 0; i < quizA[currentQuestion].choices.length; i++) {
    var answerBtn = document.createElement('button');
    answerBtn.textContent = quizA[currentQuestion].choices[i];
    mainEl.appendChild(answerBtn);
    answerBtn.addEventListener('click', checkAnswer)
  };
};

// If there was a previous wrong answer and they pick another wrong answer, will remove the last wrongMsg p and insert a new one. 
var wrongMsg = () => {
  var removeWrongMsg = document.querySelector('p');
  if (removeWrongMsg == 'p'){
    removeWrongMsg.remove();
  };

  //lets user know they picked wrong answer.
  var wrongAnswer = document.createElement('p');
  wrongAnswer.textContent = 'Sorry. That was incorrect. Try Again!';

  mainEl.appendChild(wrongAnswer);
}

const quizEndCheck = (currentQuestion + 1);

//checks answer choice of user. If correct, go to next q; if wrong, cross answer choice out and display wrong message. if user has time left, and finished the last question => run end of quiz screen.
var checkAnswer = (event) => {
  let answerCheck = event.target.textContent;
  let realAnswer = quizA[currentQuestion].answer;
if (answerCheck !== realAnswer) {
  event.target.setAttribute('style', 'text-decoration: line-through');
  wrongMsg();
  timeLeft -= 10;
} else {
  goNextQ();
};
};


//increase currentQuestion counter and call inQUiz to display the next question and answer set
var goNextQ = () => {
  currentQuestion++;
  if (currentQuestion === quizA.length) {
    endQuiz();
  } else {
    inQuiz();
};
}

//when timer hits 0 => Game Over screen
var gameOver = () => {
  mainEl.innerHTML = '';
  


  showTitle('GAME OVER');

  showSubTitle('You ran out of time!');

  showP('Better luck next time!');

  showP('Hit the reset button to try again or take a look at High Scores.');

  resetBtn('Reset Quiz');

};

//blanks the timerEl text on screen; resets the timer to its original value so that the timer can start again at the top when user initiates a new quiz.
const resetTimer = () => {
  timerEl.textContent = '';
  clearInterval(timeInterval);
  timeLeft = 30;
  homepage();
};

//end of quiz page that allows for initials and score to be saved. 


const resetBtn = (btntext) => {
  var resetBtn = document.createElement('button');
  resetBtn.textContent = btntext;
  mainEl.appendChild(resetBtn);
  resetBtn.addEventListener('click', resetTimer);
};

// const formMaker = () => {
//   var form = document.createElement('form');
//   form.setAttribute('id', 'form');
//   form.textContent = '';
//   mainEl.appendChild(form);
// }

var initialsUserInput= () => {
  var initials = document.createElement('input');
  initials.setAttribute('type', 'text');
  initials.setAttribute('maxlength', 2);
  initials.setAttribute('id', 'initials');
  mainEl.appendChild(initials);
};


var saveInitialsBtn = () => {
  var saveIBtn = document.createElement('button');
  saveIBtn.textContent = 'Save';
  mainEl.appendChild(saveIBtn);
  saveIBtn.addEventListener('click', saveHighScore);
};

const endQuiz = () => {
  mainEl.innerHTML = '';
  
  showTitle('Congratulations! You finished the quiz!');

  showP('Please enter your initials and save your score');

  initialsUserInput();
  saveInitialsBtn();
}



var saveHighScore = () => {
  const initialsInput = document.querySelector('#initials');
  let saveName = initialsInput.value.trim();
  let storedNames = JSON.parse(localStorage.getItem('name') || '[]');
  
  if (saveName !== '' && storedNames !== null) {
    storedNames.push(saveName);
    localStorage.setItem('name', JSON.stringify(storedNames));
    backHomeAfterSave();
  } else if (saveName !== '' && storedNames == null) {
    storedNames = initialsList;
    storedNames.push(saveName);
    localStorage.setItem('name', JSON.stringify(storedNames));
    backHomeAfterSave();
  } else {
    alert('Please enter your initials');

    endQuiz();
  };
};

var highScoreBtn = () => {
  var hsBtn = document.createElement('button');
  hsBtn.textContent = 'High Scores';
  mainEl.appendChild(hsBtn);
  hsBtn.addEventListener('click', showHighScore)
}

var backHomeAfterSave = () => {
  mainEl.innerHTML = '';

  showTitle('Your score has been saved.');

  showP('Click the HighScore button or the High Scores link to view past attempts');
  showP('Click the Home button to go back to the start and take another quiz');
  highScoreBtn();
  resetBtn('Home');
}


var showHighScore = () => {
  mainEl.innerHTML = '';

  showTitle('Last Quiz Scores')
  let ul = document.createElement('ul');
  ul.setAttribute('id', 'score-list');
  mainEl.appendChild(ul);
  retrieveSaved();
  resetBtn('Home');

}

var retrieveSaved = () => {
  let getNames = JSON.parse(localStorage.getItem('name'));
  let getScores = JSON.parse(localStorage.getItem('highScore'));


  for (let i = 0; i < getNames.length; i++) {
    var li = document.createElement('li');
    li.textContent = getNames[i] + ' - ' + getScores[i];
    let addUl = document.querySelector('#score-list');
    addUl.appendChild(li);
  }
}





  homepage();

//if you click the home anchor; will stop the timer, reset it, and take the user back to the homepage
homeAEl.addEventListener('click', resetTimer);




// var quizBtn = () => {
//   var quizBtn = document.createElement('button');
//   quizBtn.textContent = 'Skip Question';
//   mainEl.appendChild(quizBtn);
//   quizBtn.addEventListener('click', goNextQ);
// };
// var previousBtn = () => {
//   var previousBtn = document.createElement('button');
//   previousBtn.textContent = 'Previous Question';
//   mainEl.appendChild(previousBtn);
//   previousBtn.addEventListener('click', backQ)
// }

// var backQ = () => {
//   currentQuestion--;
//   inQuiz();
// }


// var lastQBtn = () => {
//   var lastQBtn = document.createElement('button');
//   lastQBtn.textContent =  'Finish Quiz';
//   mainEl.appendChild(lastQBtn);
//   //add an event listener to fun end page function on click
// };