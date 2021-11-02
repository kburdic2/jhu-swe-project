(function() {
  //-------------------------Variables-------------------------//
  
  // Grouped Screen Elements by IDs
  var alwaysVisible = document.getElementById("alwaysVisible");
  var playerList = document.getElementById("playerList");
  var connectScreen = document.getElementById("connectScreen");
  var lobbyScreen = document.getElementById("lobbyScreen");
  var spinScreen = document.getElementById("spinScreen");
  var questionsLeft = document.getElementById("questionsLeft");
  var pointValueScreen = document.getElementById("pointValueScreen");
  var buzzInScreen = document.getElementById("buzzInScreen");
  var answerScreen = document.getElementById("answerScreen");
  
  // Screen Elements
  var connectScreenButton = document.getElementById('connectButton');
  var playButton = document.getElementById('playButton');
  var spinButton = document.getElementById('spinButton');
  var wheel = document.getElementById('wheel');
  const categoryDisplay = document.getElementById('categoryDisplay');
  var usernameInput = document.getElementById("usernameInput");
  var PVDisplayText = document.getElementById("PVDisplayText");
  var PVDisplayText2 = document.getElementById("PVDisplayText2");
  var buzzerButton = document.getElementById('buzzerButton');
  var questionDisplay = document.getElementById('questionDisplay');
  var questionDisplay2 = document.getElementById('questionDisplay2');

  // Point Value Buttons
  var PV1Button = document.getElementById("PVButton1");
  var PV2Button = document.getElementById("PVButton2");
  var PV3Button = document.getElementById("PVButton3");
  var PV4Button = document.getElementById("PVButton4");
  var PV5Button = document.getElementById("PVButton5");

  // Answer Buttons
  var answer1Button = document.getElementById("answer1Button");
  var answer2Button = document.getElementById("answer2Button");
  var answer3Button = document.getElementById("answer3Button");
  var answer4Button = document.getElementById("answer4Button");

  // Answer Labels
  var answer1Text = document.getElementById("answer1Text");
  var answer2Text = document.getElementById("answer2Text");
  var answer3Text = document.getElementById("answer3Text");
  var answer4Text = document.getElementById("answer4Text");

  // User Input variables
  var username = "";
  var numQuestions = 0;
  var pointValue = 0;

  // Question Variables (Will convert to array of categories/questions)
  var question = "This is a great question!";
  var answer1 = "A. It sure is!";
  var answer2 = "B. No it isn't!";
  var answer3 = "C. Eh, it's alright";
  var answer4 = "D. This isn't a question...";
  var correctAnswer = answer1;

  // Wheel variables
  let deg = 0;

  //-------------------------Functions-------------------------//

  // Determine the category the wheel landed on
  function findCategory(actualDeg)
  {
    let category = '';
    if ((actualDeg < 30) || (actualDeg >= 330)) {
      category = "Green";
    }
    if ((actualDeg >= 30) && (actualDeg < 90)){
      category = "Yellow";
    }
    if ((actualDeg >= 90) && (actualDeg < 150)){
      category = "Orange";
    }
    if ((actualDeg >= 150) && (actualDeg < 210)){
      category = "Red";
    }
    if ((actualDeg >= 210) && (actualDeg < 270)){
      category = "Purple";
    }
    if ((actualDeg >= 270) && (actualDeg < 330)){
      category = "Blue";
    }

    categoryDisplay.innerHTML = category;
  }

  function findWinner()
  {
    var winner = '';
    var winnerPoints = 0;
    for (let i = 1; i <= 3; i++)
    {
      var currPlayerPoints = Number(document.getElementById('player'+i+'Points').innerText);
      if (winnerPoints == 0 || currPlayerPoints > winnerPoints)
      {
        winnerPoints = currPlayerPoints;
        winner = document.getElementById('player'+i+'Name').innerText
      }
    }

    console.log("Winner: "+winner);
    console.log("Points: "+winnerPoints);
    return {winner, winnerPoints};
  }

  //-------------------------Initialization-------------------------//

  // Initialize to connect screen
  alwaysVisible.style.visibility = 'visible';
  connectScreen.style.visibility = 'visible';
  playerList.style.visibility = 'hidden';
  lobbyScreen.style.visibility = 'hidden';
  spinScreen.style.visibility = 'hidden';
  questionsLeft.style.visibility = 'hidden';
  pointValueScreen.style.visibility = 'hidden';
  buzzInScreen.style.visibility = 'hidden';
  answerScreen.style.visibility = 'hidden';

  //-------------------------Events-------------------------//

  // Connect Button Pressed
  connectScreenButton.addEventListener('click', () => {

    // No input
    if (usernameInput.value.length == 0)
    {
      usernameInput.style.color = 'red';
      usernameInput.value = 'Enter a Username';
    }
    // Username too long
    else if (usernameInput.value.length > 20)
    {
      usernameInput.style.color = 'red';
      usernameInput.value = 'Name too long';
    }
    // Good, non-error-message input
    else if (usernameInput.style.color != 'red')
    {
      username = usernameInput.value;
      connectScreen.style.visibility = 'hidden';
      lobbyScreen.style.visibility = 'visible';
      playerList.style.visibility = 'visible';

      document.getElementById("player3Name").innerHTML = "<b>"+username+"</b>";
    }
  });

  // Check when the user clicks into the username box (Reset the box from error case)
  usernameInput.addEventListener('click', () => {
    usernameInput.style.color = 'black';
    usernameInput.value = '';
  });

  // Play Button Pressed
  playButton.addEventListener('click', () => {
    questionNumberInput = document.getElementById("questionNumberInput");
    errorQuestionNumber = document.getElementById("errorQuestionNumber");

    // Validate input
    if (questionNumberInput.value > 0 && questionNumberInput.value <= 30)
    {
      numQuestions = questionNumberInput.value;
      errorQuestionNumber.style.visibility = "hidden";
      lobbyScreen.style.visibility = 'hidden';
      spinScreen.style.visibility = 'visible';
      spinButton.style.visibility = 'visible';
      playerList.style.visibility = 'visible';
      questionsLeft.style.visibility = 'visible';

      document.getElementById("questionsLeftNumber").innerHTML = "<b>"+numQuestions+"</b>";
    }
    else
    {
      errorQuestionNumber.style.visibility = "visible";
    }
  });

  // Spin Button Pressed
  spinButton.addEventListener('click', () => {
    categoryDisplay.innerHTML = "";
    let spin_var = 0;
    let min = Math.ceil(100);
    let max = Math.floor(5000);
    spin_var = Math.floor(Math.random() * (max - min) + min);
    deg = Math.floor(spin_var + Math.random() * spin_var);
    wheel.style.transition = 'all 10s ease-out';
    wheel.style.transform = `rotate(${deg}deg)`;
    wheel.classList.add('blur');
    spinButton.style.visibility = 'hidden';
  });

  // Handle Wheel Spinning
  wheel.addEventListener('transitionend', () => {
    wheel.classList.remove('blur');
    wheel.style.transition = 'none';
    const actualDeg = (deg % 360);
    wheel.style.transform = `rotate(${actualDeg}deg)`;
    findCategory(actualDeg);

    spinScreen.style.visibility = 'hidden';
    pointValueScreen.style.visibility = 'visible';
  });

  //----------Point Value Buttons----------//
  // PV1 Button Pressed
  PV1Button.addEventListener('click', () => {
    pointValue = 10;
    pointValueScreen.style.visibility = 'hidden';
    buzzInScreen.style.visibility = 'visible';
    PVDisplayText.innerHTML = "<b>"+pointValue+"</b>";
    PVDisplayText2.innerHTML = "<b>"+pointValue+"</b>";
    questionDisplay.innerHTML = "<b>"+question+"</b>";
    questionDisplay2.innerHTML = "<b>"+question+"</b>";
  });
  // PV2 Button Pressed
  PV2Button.addEventListener('click', () => {
    pointValue = 20;
    pointValueScreen.style.visibility = 'hidden';
    buzzInScreen.style.visibility = 'visible';
    PVDisplayText.innerHTML = "<b>"+pointValue+"</b>";
    PVDisplayText2.innerHTML = "<b>"+pointValue+"</b>";
    questionDisplay.innerHTML = "<b>"+question+"</b>";
    questionDisplay2.innerHTML = "<b>"+question+"</b>";
  });
  // PV3 Button Pressed
  PV3Button.addEventListener('click', () => {
    pointValue = 30;
    pointValueScreen.style.visibility = 'hidden';
    buzzInScreen.style.visibility = 'visible';
    PVDisplayText.innerHTML = "<b>"+pointValue+"</b>";
    PVDisplayText2.innerHTML = "<b>"+pointValue+"</b>";
    questionDisplay.innerHTML = "<b>"+question+"</b>";
    questionDisplay2.innerHTML = "<b>"+question+"</b>";
  });
  // PV4 Button Pressed
  PV4Button.addEventListener('click', () => {
    pointValue = 40;
    pointValueScreen.style.visibility = 'hidden';
    buzzInScreen.style.visibility = 'visible';
    PVDisplayText.innerHTML = "<b>"+pointValue+"</b>";
    PVDisplayText2.innerHTML = "<b>"+pointValue+"</b>";
    questionDisplay.innerHTML = "<b>"+question+"</b>";
    questionDisplay2.innerHTML = "<b>"+question+"</b>";
  });
  // PV5 Button Pressed
  PV5Button.addEventListener('click', () => {
    pointValue = 50;
    pointValueScreen.style.visibility = 'hidden';
    buzzInScreen.style.visibility = 'visible';
    PVDisplayText.innerHTML = "<b>"+pointValue+"</b>";
    PVDisplayText2.innerHTML = "<b>"+pointValue+"</b>";
    questionDisplay.innerHTML = "<b>"+question+"</b>";
    questionDisplay2.innerHTML = "<b>"+question+"</b>";
  });

  // Buzz-In Button Pressed
  buzzerButton.addEventListener('click', () => {
    buzzInScreen.style.visibility = 'hidden';
    answerScreen.style.visibility = 'visible';
    answer1Text.innerHTML = answer1;
    answer2Text.innerHTML = answer2;
    answer3Text.innerHTML = answer3;
    answer4Text.innerHTML = answer4;
  });

  //----------Answer Buttons----------//
  // Answer 1 Pressed
  answer1Button.addEventListener('click', () => {
    if (answer1Text.innerHTML == correctAnswer)
    {
      answer1Button.src = "assets/CorrectAnswerButton.png";

      // Go to lobby screen with winner displayed
      answerScreen.style.visibility = 'hidden';
      lobbyScreen.style.visibility = 'visible';
      let {winner, winnerPoints} = findWinner();
      document.getElementById("winnerLabel").innerText = winner+" has won with "+winnerPoints+" points!";
      document.getElementById("playButton").src = "assets/PlayAgainButton.png";

      // Reset answer buttons
      for (let i = 1; i < 5; i++)
      {
        document.getElementById("answer"+i+"Button").src = "assets/AnswerButton.png";
      }

    }
    else
    {
      answer1Button.src = "assets/IncorrectAnswerButton.png";
      for (let i = 1; i < 5; i++)
      {
        var currAnswer = document.getElementById("answer"+i+"Text");
        if (currAnswer.innerHTML == correctAnswer)
        {
          document.getElementById("answer"+i+"Button").src = "assets/CorrectAnswerButton.png";
          break;
        }
      }
    }


  });
  // Answer 2 Pressed
  answer2Button.addEventListener('click', () => {
    if (answer2Text.innerHTML == correctAnswer)
    {
      answer2Button.src = "assets/CorrectAnswerButton.png";

      // Go to lobby screen with winner displayed
      answerScreen.style.visibility = 'hidden';
      lobbyScreen.style.visibility = 'visible';
      let {winner, winnerPoints} = findWinner();
      document.getElementById("winnerLabel").innerText = winner+" has won with "+winnerPoints+" points!";
      document.getElementById("playButton").src = "assets/PlayAgainButton.png";

      // Reset answer buttons
      for (let i = 1; i < 5; i++)
      {
        document.getElementById("answer"+i+"Button").src = "assets/AnswerButton.png";
      }
    }
    else
    {
      answer2Button.src = "assets/IncorrectAnswerButton.png";
      for (let i = 1; i < 5; i++)
      {
        var currAnswer = document.getElementById("answer"+i+"Text");
        if (currAnswer.innerHTML == correctAnswer)
        {
          document.getElementById("answer"+i+"Button").src = "assets/CorrectAnswerButton.png";
          break;
        }
      }
    }
  });
  // Answer 3 Pressed
  answer3Button.addEventListener('click', () => {
    if (answer3Text.innerHTML == correctAnswer)
    {
      answer3Button.src = "assets/CorrectAnswerButton.png";

      // Go to lobby screen with winner displayed
      answerScreen.style.visibility = 'hidden';
      lobbyScreen.style.visibility = 'visible';
      let {winner, winnerPoints} = findWinner();
      document.getElementById("winnerLabel").innerText = winner+" has won with "+winnerPoints+" points!";
      document.getElementById("playButton").src = "assets/PlayAgainButton.png";

      // Reset answer buttons
      for (let i = 1; i < 5; i++)
      {
        document.getElementById("answer"+i+"Button").src = "assets/AnswerButton.png";
      }
    }
    else
    {
      answer3Button.src = "assets/IncorrectAnswerButton.png";
      for (let i = 1; i < 5; i++)
      {
        var currAnswer = document.getElementById("answer"+i+"Text");
        if (currAnswer.innerHTML == correctAnswer)
        {
          document.getElementById("answer"+i+"Button").src = "assets/CorrectAnswerButton.png";
          break;
        }
      }
    }
  });
  // Answer 4 Pressed
  answer4Button.addEventListener('click', () => {
    if (answer4Text.innerHTML == correctAnswer)
    {
      answer4Button.src = "assets/CorrectAnswerButton.png";

      // Go to lobby screen with winner displayed
      answerScreen.style.visibility = 'hidden';
      lobbyScreen.style.visibility = 'visible';
      let {winner, winnerPoints} = findWinner();
      document.getElementById("winnerLabel").innerText = winner+" has won with "+winnerPoints+" points!";
      document.getElementById("playButton").src = "assets/PlayAgainButton.png";

      // Reset answer buttons
      for (let i = 1; i < 5; i++)
      {
        document.getElementById("answer"+i+"Button").src = "assets/AnswerButton.png";
      }
    }
    else
    {
      answer4Button.src = "assets/IncorrectAnswerButton.png";
      for (let i = 1; i < 5; i++)
      {
        var currAnswer = document.getElementById("answer"+i+"Text");
        if (currAnswer.innerHTML == correctAnswer)
        {
          document.getElementById("answer"+i+"Button").src = "assets/CorrectAnswerButton.png";
          break;
        }
      }
    }
  });

})();
