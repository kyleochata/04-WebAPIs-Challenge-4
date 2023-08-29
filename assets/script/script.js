//variables
const timerEl = document.querySelector('#timer');
const mainEl = document.querySelector('#main');
const homeAEl = document.querySelector('#home-a');
const highScoreAEl = document.querySelector('#highscore-a');

let currentQuestion = 0;

//quiz q + a object
const quizA = [
  {question: "A 44 year old man from Texas rushes to the ED for blood in his urine. During examination, it is revealed that the man has crescentic glomerulonephritis, mucosal ulcerations throughout the respiratory tract, rashes, and sinusitis. After lab testing, it is determined that the pathogenesis of all of these sxs are due to PR3-ANCA mediation. Which of the following sxs should also be present in this mans case?",
  choices: ["Asthma", "GI Bleeding", "Hemoptysis", "Palpable purpura", "Muscle pain / weakness"],
  answer: "Palpable purpura",
}, {
  question: "A 55 year old man comes to the office for coughing up blood. The man has histo slides prepared of his small vessels and it shows segmental fibrinoid necrosis of the media w/ focal transmural necrotizing lesions. No granulomas or eosinophils are seen. In the postcapillary venules, only infiltrating and fragmenting neutrophils are seen. Which of the following organs would be spared by this disease? ",
  choices: ['Lungs', 'Muscles', 'GI', 'Kidney', 'Skin', 'None of the above'],
  answer: 'None of the above',
}, {
  question: 'A 50 year old man comes into the office with suspected chronic renal damage. Ultrasound reveals advanced renal disease with shrunken kidneys. The mans presenting sxs are consistent with nephrotic syndrome. Labs show creatinine, complement, BP are wnl. Labs also showed that there is limited proteinuria of < 1 g/day.  PMH reveals that he had a streptococcal infection 1 week ago that resolved itself yesterday. Which of the following would results would be the best reason to perform a renal biopsy?',
  choices: ['Ultrasound results', 'Nephrotic syndrome symptoms', 'Lab results', 'Proteinuria', 'Post streptococcal infection'],
  answer: 'Nephrotic syndrome symptoms',
}, {
  question: 'A 45 year old woman comes to the office for an update on her medication. She has been recently been on warfarin for a stroke she had 2 months ago. The lady reports that she has noticed that cuts on her hands have been bleeding longer than normal. SH shows that she is a chef and is at risk for cuts and scrapes from working with a knife. The pt asks to be place on a different drug that will allow for no monitoring requirements, but as effective as warfarin. Which of the following would be an adequate replacement for warfarin?',
  choices: ['Heparin', 'Apixaban', 'Argatroban', 'Fondaparinux', 'LMWH'],
  answer: 'Apixaban',
}, {
  question: 'A pt comes into the ED after a MVA. The emergency medicine attending reads over the note that gives the following: 50 yo f with excessive bleeding from an abdominal wound. Pt is currently on heparin for a DVT diagnosed 2 weeks ago. The attending decides to prescribe a drug to help stop the bleeding of this pt after stitching them up. Which of the following is most likely to be given to this pt?',
  choices: ['Vitamin K', 'Aminocaproic Acid', 'Urokinase', 'Protamine Sulfate', 'Streptokinase'],
  answer: 'Protamine Sulfate',
}
];

let initialsList = [];
let highScoreList = [];
let timeInterval;
//max time allowed for the quiz
let timeLeft = 100;

//when page loads for first time or when you click the home anchor in the header; run this fxn to display our home screen

//create container for entire text to be rendered into. Styling too
const createCard = () => {
  const cardDiv = document.createElement('div');
  cardDiv.setAttribute('class', 'card')
  mainEl.appendChild(cardDiv);
}

const showTitle = (titleContent) => {
  const title = document.createElement('h1');
  title.textContent = titleContent;
  title.classList.add('home-title');
  let card = document.querySelector('.card');
  card.appendChild(title);
};

const showSubTitle = (subTitleContent) => {
  const subTitle = document.createElement('h2');
  subTitle.textContent = subTitleContent;
  subTitle.classList.add('sub-title');
  let card = document.querySelector('.card');
  card.appendChild(subTitle);
};

const showP = (paraContent) => {
  const pContent = document.createElement('p');
  pContent.textContent = paraContent;
  pContent.classList.add('home-para');
  let card = document.querySelector('.card');
  card.appendChild(pContent);
};

const startBtn = () => {
  const btnStart = document.createElement('button');
  btnStart.textContent = 'Start Quiz!';
  btnStart.setAttribute('id', 'home-start-btn');
  let card = document.querySelector('.card');
  card.appendChild(btnStart);
  btnStart.addEventListener('click', startQuiz);

};

//render in the home page to welcome use and show rules; how scoring works
const homepage = () => {

  mainEl.textContent = '';
  
  createCard();


  showTitle('Ready to take this challenge!?');

  showSubTitle('Read below to start!');

  showP('Rules: The quiz will begin when you hit the start button. The timer in the top right corner will keep track of the time remaining to complete the quiz. If you get a question wrong: 10 seconds will be subtracted from the timer as a penalty. If you finish all questions or the timer hits 0 seconds, the quiz is over!');

  showP('Score: the time remaining when you finish the quiz is equal to your score. Good Luck!');
  
  startBtn();

};

//blanks the timerEl text on screen; resets the timer to its original value so that the timer can start again at the top when user initiates a new quiz.
const resetTimer = () => {
  timerEl.textContent = '';
  clearInterval(timeInterval);
  timeLeft = 100;
  homepage();
};

//create button that will take user back to homepage
const resetBtn = (btntext) => {
  var resetBtn = document.createElement('button');
  resetBtn.textContent = btntext;
  resetBtn.setAttribute('class', 'reset');
  let card = document.querySelector('.card');
  card.appendChild(resetBtn);
  resetBtn.addEventListener('click', resetTimer);
};

//when timer hits 0 => Game Over screen
const gameOver = () => {
  mainEl.innerHTML = '';
  
  createCard();

  showTitle('GAME OVER');

  showSubTitle('You ran out of time!');

  showP('Better luck next time!');

  showP('Hit the reset button to try again or take a look at High Scores.');

  resetBtn('Reset Quiz');

};

//function for timer. Allows for time to be saved as score when user solves the final question. Clears the timer if timer hits 0. will show game over screen
const timer = () => {

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



//on start button clear the <main> inner content. have timer start. indicate which question they're on with currentQuestion
const startQuiz = () => {
  mainEl.innerHTML = '';
  currentQuestion = 0;
  timer();
  createCard();
  inQuiz();
};

//clear main of children; generate container; place question and answer choices within the container
const inQuiz = () => {
  mainEl.innerHTML = '';
  createCard();
  questionLabel();
  answerChoiceBtn();
}




//create question to be answered as a label.
const questionLabel = () => {
  var questionL = document.createElement('label'); //
  questionL.textContent = quizA[currentQuestion].question;
  questionL.classList.add('question-label');
  let card = document.querySelector('.card');
  card.appendChild(questionL);
};

//creating buttons for the user to pick. 
const answerChoiceBtn = () => {
  for (let i = 0; i < quizA[currentQuestion].choices.length; i++) {
    var answerBtn = document.createElement('button');
    answerBtn.textContent = quizA[currentQuestion].choices[i];
    answerBtn.setAttribute('class', 'answer-choices');
    let card = document.querySelector('.card');
    card.appendChild(answerBtn);
    answerBtn.addEventListener('click', checkAnswer)
  };
};

  //lets user know they picked wrong answer.
  const sorryP = () => {
    let wrongAnswer = document.createElement('p');
    wrongAnswer.textContent = 'Sorry. That was incorrect. Try Again!';
    wrongAnswer.setAttribute('class', 'wrong-p');
    let card = document.querySelector('.card');
    card.appendChild(wrongAnswer);
  }

// If there was a previous wrong answer and they pick another wrong answer, will remove the last wrongMsg p and insert a new one. 
const wrongMsg = () => {
  let removeWrongMsg = document.querySelector('.wrong-p');
  if (removeWrongMsg === null) {
    sorryP();
  } else if (removeWrongMsg.matches('.wrong-p')) {
    removeWrongMsg.remove();
    sorryP();
  } else {
    return;
  }

}

//increase currentQuestion counter and call inQUiz to display the next question and answer set
const goNextQ = () => {
  currentQuestion++;
  if (currentQuestion === quizA.length) {
    createCard();
    endQuiz();
  } else {
    createCard();
    inQuiz();
};
}

//checks answer choice of user. If correct, go to next q; if wrong, cross answer choice out and display wrong message. if user has time left, and finished the last question => run end of quiz screen.
const checkAnswer = (event) => {
  let answerCheck = event.target.textContent;
  let realAnswer = quizA[currentQuestion].answer;
if (answerCheck !== realAnswer) {
  event.target.setAttribute('style', 'text-decoration: line-through; background-color: #FF7276');
  wrongMsg();
  timeLeft -= 10;
} else {
  goNextQ();
};
};


//end of quiz page that allows for initials and score to be saved. 
const initialsUserInput= () => {
  var initials = document.createElement('input');
  initials.setAttribute('type', 'text');
  initials.setAttribute('maxlength', 2);
  initials.setAttribute('id', 'initials');
  let card = document.querySelector('.card');
  card.appendChild(initials);
};

//save highscore to local storage. To be viewed on hitting 
const saveHighScore = () => {
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
    alert('Please enter your initials. Max 2 characters');

    endQuiz();
  };
};

const saveInitialsBtn = () => {
  var saveIBtn = document.createElement('button');
  saveIBtn.textContent = 'Save';
  saveIBtn.setAttribute('class', 'save-btn');
  let card = document.querySelector('.card');
  card.appendChild(saveIBtn);
  saveIBtn.addEventListener('click', saveHighScore);
};

const endQuiz = () => {
  mainEl.innerHTML = '';
  
  createCard();
  showTitle('Congratulations! You finished the quiz!');

  showP('Please enter your initials and save your score');

  initialsUserInput();
  saveInitialsBtn();
}

//functions needed to generate highscore button
const highScoreBtn = () => {
  var hsBtn = document.createElement('button');
  hsBtn.textContent = 'High Scores';
  let card = document.querySelector('.card');
  card.appendChild(hsBtn);
  hsBtn.addEventListener('click', showHighScore)
}

//function to show user message after they have saved their initials
const backHomeAfterSave = () => {
  mainEl.innerHTML = '';
  createCard();
  showTitle('Your score has been saved.');

  showP('Click the HighScore button or the High Scores link to view past attempts');
  showP('Click the Home button to go back to the start and take another quiz');
  highScoreBtn();
  resetBtn('Home');
}

//function to show the highscore list, by clicking the high score anchor or button
const showHighScore = () => {
  clearInterval(timeInterval);
  mainEl.innerHTML = '';
  createCard();
  showTitle('Last Quiz Scores');
  let card = document.querySelector('.card');
  let ul = document.createElement('ul');
  ul.setAttribute('id', 'score-list');
  card.appendChild(ul);
  retrieveSaved();
  resetBtn('Home');
}

const retrieveSaved = () => {
  let getNames = JSON.parse(localStorage.getItem('name'));
  let getScores = JSON.parse(localStorage.getItem('highScore'));


  for (let i = 0; i < getNames.length; i++) {
    const li = document.createElement('li');
    li.textContent = getNames[i] + ' - ' + getScores[i];
    let addUl = document.querySelector('#score-list');
    addUl.appendChild(li);
  }
}





  homepage();

//if you click the home anchor; will stop the timer, reset it, and take the user back to the homepage
homeAEl.addEventListener('click', resetTimer);
//click highscore anchor, will stop timer, reset it and 
highScoreAEl.addEventListener('click', showHighScore);
