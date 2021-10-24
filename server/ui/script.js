(function() {

  var connectScreenButton = document.getElementById('connectButton');
  var playButton = document.getElementById('playButton');
  var spinButton = document.getElementById('spinButton');
  var wheel = document.getElementById('wheel');
  var usernameInput = document.getElementById("usernameInput");

  // Grouped IDs
  var alwaysVisible = document.getElementById("alwaysVisible");
  var playerList = document.getElementById("playerList");
  var connectScreen = document.getElementById("connectScreen");
  var lobbyScreen = document.getElementById("lobbyScreen");
  var spinScreen = document.getElementById("spinScreen");
  var questionsLeft = document.getElementById("questionsLeft");
  
  // Initialize to connect screen
  alwaysVisible.style.visibility = 'visible';
  connectScreen.style.visibility = 'visible';
  playerList.style.visibility = 'hidden';
  lobbyScreen.style.visibility = 'hidden';
  spinScreen.style.visibility = 'hidden';
  questionsLeft.style.visibility = 'hidden';

  var username = "";
  var numQuestions = 0;

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
      usernameInput.value = '1-20 characters';
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
    deg = Math.floor(500 + Math.random() * 500);
    wheel.style.transition = 'all 10s ease-out';
    wheel.style.transform = `rotate(${deg}deg)`;

    spinButton.style.visibility = 'hidden';

    //connectScreen.style.visibility = 'visible';
    //lobbyScreen.style.visibility = 'hidden';
    //spinScreen.style.visibility = 'hidden';
    //playerList.style.visibility = 'hidden';
    //questionsLeft.style.visibility = 'hidden';
  });

  wheel.addEventListener('transitionend', () => {
    wheel.style.transition = 'none';
    const actualDeg = deg % 360;
    wheel.style.transform = `rotate(${actualDeg}deg)`;
  });
})();
