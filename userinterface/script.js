(function() {
  var connectScreenButton = document.getElementById('connectButton');
  var playButton = document.getElementById('playButton');
  var spinButton = document.getElementById('spinButton');
  var wheel = document.getElementById('wheel');

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
    usernameInput = document.getElementById("usernameInput");
    errorUsername = document.getElementById("errorUsername");

    // Validate input
    if (usernameInput.value.length != 0)
    {
      username = usernameInput.value;
      errorUsername.style.visibility = 'hidden';
      connectScreen.style.visibility = 'hidden';
      lobbyScreen.style.visibility = 'visible';
      playerList.style.visibility = 'visible';

      document.getElementById("player3Name").innerHTML = "<b>"+username+"</b>";
    }
    else
    {
      errorUsername.style.visibility = 'visible';
    }
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
    connectScreen.style.visibility = 'visible';
    lobbyScreen.style.visibility = 'hidden';
    spinScreen.style.visibility = 'hidden';
    playerList.style.visibility = 'hidden';
    questionsLeft.style.visibility = 'hidden';
  });
  
})();
