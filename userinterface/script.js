(function() {
  var connectScreenButton = document.getElementById('connectButton');
  var playButton = document.getElementById('playButton');
  var spinButton = document.getElementById('spinButton');
  var wheel = document.getElementById('wheel');
  const categoryDisplay = document.getElementById('categoryDisplay');
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

  // User Input variables
  var username = "";
  var numQuestions = 0;

  // Wheel variables
  let deg = 0;
  let zoneSize = 60;

  // Determine the category the wheel landed on
  const findCategory = (actualDeg) => {
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
    categoryDisplay.innerHTML = "-";
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
    spinButton.style.visibility = 'visible';
  });
  
})();
