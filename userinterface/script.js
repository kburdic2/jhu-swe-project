(function() {
  //-------------------------Variables-------------------------//
  
  // Socket io
  var socket = io();
  var playerId = Math.floor(Math.random() * 100);
  var connectAck = document.getElementById('connectButton');
  var buzzInAck = document.getElementById('buzzerButton');

  // Player Data
  var player1_Name = document.getElementById('player1Name');
  var player2_Name = document.getElementById('player2Name');
  var player3_Name = document.getElementById('player3Name');

  var player1Points = document.getElementById('player1Points');
  var player2Points = document.getElementById('player2Points');
  var player3Points = document.getElementById('player3Points');

  var player1ID;
  var player2ID;
  var player3ID;

  var buzzedInPlayer;
  var serverID;

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
  const categoryDisplay = document.getElementById('categoryDisplay');
  var usernameInput = document.getElementById("usernameInput");
  var PVDisplayText = document.getElementById("PVDisplayText");
  var PVDisplayText2 = document.getElementById("PVDisplayText2");
  var buzzerButton = document.getElementById('buzzerButton');
  var buzzInTimer = document.getElementById('buzzInTimer');
  var answerTimer = document.getElementById('answerTimer');
  var answerDisplay = document.getElementById('answerDisplay');
  var questionDisplay = document.getElementById('questionDisplay');
  var questionDisplay2 = document.getElementById('questionDisplay2');
  var muteButton = document.getElementById('muteButton');
  var questionsLeftNumber = document.getElementById("questionsLeftNumber");

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

  var category;
  var correctAnswer;
  var questionAnswered = false;

  // Timer Lengths
  const PVtimerLength = "3";
  const answerDisplayLength = "5";
  const buzzInTimerLength = "9";
  const answerTimerLength = "15";

  // Audio Variables
  var muted = false;
  var themeMusic = new Audio('Assets/Theme.mp3');
  themeMusic.loop = true;
  themeMusic.volume = 0.3;
  var jeopardyMusic = new Audio('Assets/Jeopardy_Music.mp3');
  jeopardyMusic.volume = 0.2;
  var buzzerAudio = new Audio('Assets/Buzzer.mp3');
  var applauseAudio = new Audio('Assets/Applause.mp3');
  var awwAudio = new Audio('Assets/Aww.mp3');

  // Wheel variables
  var wheelCanvas = document.getElementById("wheel");
  const widthReference = 2560;
  const heightReference = 1329;
  wheelCanvas.width = 750 * (window.innerWidth/widthReference);
  wheelCanvas.height = 750 * (window.innerHeight/heightReference);
  const initializedBank = randomize();
  let qBank = initializedBank[0];
  let rCate = initializedBank[1];
  var wheelSpun = false;

  // Unchanging Wheel colored sectors
  let originalSectors = [{
    color: "#fff000",
    label: ""
  },
  {
    color: "#00cd22",
    label: ""
  },
  {
    color: "#c84fff",
    label: ""
  },
  {
    color: "#0095fe",
    label: ""
  },
  {
    color: "#fe0000",
    label: ""
  },
  {
    color: "#fe6900",
    label: ""
  },
];

  // Wheel colored sectors
  let sectors = [{
    color: "#fff000",
    label: ""
  },
  {
    color: "#00cd22",
    label: ""
  },
  {
    color: "#c84fff",
    label: ""
  },
  {
    color: "#0095fe",
    label: ""
  },
  {
    color: "#fe0000",
    label: ""
  },
  {
    color: "#fe6900",
    label: ""
  },
];

// More wheel variables
const rand = (m, M) => Math.random() * (M - m) + m;
let tot = sectors.length;
let EL_spin = document.querySelector("#spin");
let ctx = document.querySelector("#wheel").getContext('2d');
let dia = ctx.canvas.width;
let rad = dia / 2;
let PI = Math.PI;
let TAU = 2 * PI;
let arc = TAU / sectors.length;
const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians

//--------------------- Client Messages ---------------------

// TODO: Merge with user interface event listeners
// TODO: Fix player cursors

// ------ Event Listeners -----
// CONNECT
connectAck.addEventListener('click', function(e) {
  console.log('Username: ', usernameInput);
  socket.emit('connect-event', {Name: usernameInput.value});
});

// BUZZ IN
buzzInAck.addEventListener('click', function(e) {
    var now = new Date();
    console.log(now.toUTCString());
    var timeClicked = now.toUTCString();
    serverID = serverID;
    //TODO: buzzedInPlayer
    socket.emit('buzz-in', {'timeClicked': timeClicked, 'serverID': serverID, 'buzzedInPlayer': buzzedInPlayer});
});

// POINT VALUE
// CHOOSE ANSWER
// SPIN WHEEL
// -----------------------------

// SCORE UPDATE
socket.on('score-update', (data) => {
  // TODO: fix id to match current player
  // playerID = data.playerId;
  // serverID = data.serverId;

  console.log("Player Scores: ", data);
  player1Points.value = data.scores1;
  player2Points.value = data.scores2;
  player3Points.value = data.scores3;

  document.getElementById("player1Points").innerHTML = "<b>"+data.scores1+"</b>";
  document.getElementById("player2Points").innerHTML = "<b>"+data.scores2+"</b>";
  document.getElementById("player3Points").innerHTML = "<b>"+data.scores3+"</b>";

  socket.emit('score-update', {'player1Points': player1Points, 'player2Points': player2Points, 'player3Points': player3Points});

})

// UPDATE GAME STATE
socket.on('update-game-state', (data) => {
  syncAnswerTime = data.syncAnswerTime;
  serverID = data.serverID;

  socket.emit('update-game-state', {'syncAnswerTime': syncAnswerTime, 'serverID': serverID});
})

// UPDATE QUESTION TIMER
socket.on('update-question-timer', (data) => {
  syncBuzzerTime = data.syncBuzzerTime;
  serverID = data.serverID;

  socket.emit('update-question-timer', {'syncBuzzerTime': syncBuzzerTime, 'serverID': serverID});
})

// UPDATE QUESTION
socket.on('update-question', (data) => {
  questionsLeft = data.questionsLeft;
  currentCategory = data.currentCategory;
  currentQuestion = data.currentQuestion;

  answer = data.answer;
  optionA = data.optionA;
  optionB = data.optionB;
  optionC = data.optionC;
  optionD = data.optionD;

  serverID = data.serverID;

  socket.emit('update-question', {'questionsLeft': questionsLeft, 'currentCategory': currentCategory,
                                  'currentQuestion': currentQuestion, 'answer': answer, 
                                  'optionA': optionA, 'optionB': optionB, 'optionC': optionC, 'optionD': optionD});
})

// UPDATE UI
socket.on('update-ui', (data) => {
  wheelColor = data.wheelColor;
  wheelCategory = data.wheelCategory;

  currentPlayer = data.currentPlayer;
  hostPlayer = data.hostPlayer;

  player1_Name.value = data.name1;
  player2_Name.value = data.name2;
  player3_Name.value = data.name3; 
    
  player1ID = data.id1;
  player2ID = data.id2;
  player3ID = data.id3;

  player1Points = data.player1Points;
  player2Points = data.player2Points;
  player3Points = data.player3Points;

  questionsLeft = data.questionsLeft;
  currentCategory = data.currentCategory;
  currentQuestion = data.currentQuestion;
  answer = data.answer;
  optionA = data.optionA;
  optionB = data.optionB;
  optionC = data.optionC;
  optionD = data.optionD;

  serverID = data.serverID;

  socket.emit('update-ui', {'wheelColor': wheelColor, 'wheelCategory': wheelCategory, 
                            'currentPlayer': currentPlayer, 'hostPlayer': hostPlayer,
                            'player1_Name': player1_Name, 'player2_Name': player2_Name, 'player3_Name': player3_Name,
                            'player1ID': player1ID, 'player2ID': player2ID, 'player3ID': player3ID,
                            'player1Points': player1Points, 'player2Points': player2Points, 'player3Points': player3Points,
                            'questionsLeft': questionsLeft, 'currentCategory': currentCategory, 'currentQuestion': currentQuestion,
                            'answer': answer, 'optionA': optionA, 'optionB': optionB, 'optionC': optionC, 'optionD': optionD});

})

//-------------------------Functions-------------------------//

/* 
Basic sleep function
  This function works to enable a sleep, but it's important to note that all elements of a code block seem
  to execute simultaneously, so this sleep will happen at the same time as other code in the same scope.
  It's best to use the buzzInTimer while it's hidden as a timer to ensure accuracy in most cases.
*/
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

/*
Buzz in timer function
  This function uses a recursive setTimeout call to prevent the in-scope code from executing all at once.
  Use this function for most timing needs.
*/
function decrementBuzzInTimer(){
  buzzInTimer.textContent = (parseInt(buzzInTimer.textContent) - 1).toString();
  buzzInTimer.innerHTML = buzzInTimer.innerHTML.bold();
  if (parseInt(buzzInTimer.textContent) > 0)
  {
    setTimeout(decrementBuzzInTimer, 1000);
  }
  else if (parseInt(buzzInTimer.textContent) == 0 && buzzInScreen.style.visibility == 'visible') // Timer expired on buzz in screen
  {
    buzzerButton.style.cursor = "default";
    answerDisplay.textContent = "Answer: " + correctAnswer;
    answerDisplay.innerHTML = answerDisplay.innerHTML.bold();

    // Decrement questions
    numQuestions = numQuestions - 1;
    questionsLeftNumber.innerHTML = "<b>"+numQuestions+"</b>";
 
    qBank[category][0][(pointValue/10)-1] = false; // Remove question from list

    if (isEmpty(category))
    {
      removeCategory();
    }

    // Wait 5 seconds before moving to next question or next game
    if (numQuestions == 0)
    {
      setTimeout(resetGame, 5000);
      answerTimer.innerText = '1';
      setTimeout(decrementQuestionTimer, 1000, -1);
    }
    else
    {
      answerTimer.innerText = answerDisplayLength;
      setTimeout(decrementQuestionTimer, 1000, -1);
    }
  }
}

/*
Question timer function
  Similar to the buzz in timer, this function recursively uses setTimeout to create accurate timing, but
  specifically for the question timer which has different time-out behavior than the buzz in timer.
  This function is also used for the point value 3 second timer.
*/
function decrementQuestionTimer(PVindex){
  answerTimer.textContent = (parseInt(answerTimer.textContent) - 1).toString();
  answerTimer.innerHTML = answerTimer.innerHTML.bold();
  if (parseInt(answerTimer.textContent) > 0)
  {
    setTimeout(decrementQuestionTimer, 1000, PVindex);
  }
  else if (parseInt(answerTimer.textContent) == 0 && answerScreen.style.visibility == 'visible' && !questionAnswered) // Timer expired on answer screen
  {
    questionDisplay2.innerHTML = "Timer expired!".bold();
    questionDisplay2.style.color = "red";
    var playerIndex = 1;
    subtractPoints(playerIndex, parseInt(document.getElementById("player"+playerIndex+"Points").textContent));
    // Display correct answer
    for (var i = 1; i < 5; i++)
    {
      var currAnswer = document.getElementById("answer"+i+"Text");
      currAnswer.style.cursor = "default";
      if (currAnswer.innerHTML == correctAnswer)
      {
        document.getElementById("answer"+i+"Button").src = "assets/CorrectAnswerButton.png";
      }
    }
    buzzInTimer.innerHTML = "8";
    if (isEmpty(category))
    {
      removeCategory();
    }
    if (numQuestions > 0)
    {
      setTimeout(nextQuestion, 5000);
    }
    else
    {
      setTimeout(resetGame, 5000);
    }
    jeopardyMusic.pause();
    jeopardyMusic.currentTime = 0.5; // Better start time for music
  }
  else if (parseInt(answerTimer.textContent) == 0 && PVindex >= 0) // Timer expired on spin screen when displaying point value
  {
    pointValueScreen.style.visibility = 'hidden';
    buzzInScreen.style.visibility = 'visible';
    spinScreen.style.visibility = 'hidden';
    PVDisplayText.innerHTML = "<b>"+pointValue+"</b>";
    PVDisplayText2.innerHTML = "<b>"+pointValue+"</b>";

    var question = qBank[category][1][PVindex];
    questionDisplay.innerHTML = "<b>"+question+"</b>";
    questionDisplay2.innerHTML = "<b>"+question+"</b>";
    questionDisplay2.style.color = "black";

    var answers = qBank[category][3][PVindex];
    correctAnswer = qBank[category][2][PVindex];
    answers = answers.sort(shuffle);

    answer1Text.innerHTML = answers[0];
    answer2Text.innerHTML = answers[1];
    answer3Text.innerHTML = answers[2];
    answer4Text.innerHTML = answers[3];
    
    buzzInTimer.innerHTML = buzzInTimerLength.bold();
    setTimeout(decrementBuzzInTimer, 1000);
  }
  else if (parseInt(answerTimer.textContent) == 0 && buzzInScreen.style.visibility == 'visible')
  {
    nextQuestion();
  }
}

/*
Fade out audio function
  This function creates an incremental fade out of the passed-in audio. The audio will fade then be paused.
*/
function fadeOutAudio(audio){
  if (audio.volume - 0.05 > 0)
  {
    audio.volume -= 0.05;
    setTimeout(fadeOutAudio, 100, audio);
  }
  else
  {
    audio.volume = 0;
    audio.pause();
  }
}

/*
Fade in audio function
  This function ensures an audio is playing, then incrementally fades in the audio from its existing volume to the specified desiredVolume.
*/
function fadeInAudio(audio, desiredVolume){
  audio.play();
  audio.volume += 0.05;
  if (audio.volume < desiredVolume)
  {
    setTimeout(fadeInAudio, 100, audio, desiredVolume);
  }
}

/*
Reset game function
  This is the end-game scenario function which resets the point values and other elements, as well as displaying
  a winner, so that the game may be returned to its initial game state.
*/
function resetGame(){
  // Start lobby music
  themeMusic.currentTime = 0;
  themeMusic.play();

  // Go to lobby screen
  answerScreen.style.visibility = 'hidden';
  buzzInScreen.style.visibility = 'hidden';
  lobbyScreen.style.visibility = 'visible';
  answerTimer.style.visibility = 'hidden';
  questionsLeft.style.visibility = 'hidden';
  document.getElementById("playButton").src = "assets/PlayAgainButton.png";
  for (let i = 0; i < sectors.length; i++)
  {
    sectors[i].label = rCate[i];
  }
  categoryDisplay.innerText = "";

  // Display winner
  let {winner, winnerPoints} = findWinner();
  document.getElementById("winnerLabel").innerHTML = (winner+" has won with "+winnerPoints+" points!").bold();

  // Reset answer buttons
  for (let i = 1; i < 5; i++)
  {
    document.getElementById("answer"+i+"Button").src = "assets/AnswerButton.png";
  }

  // Reset used questions
  for (var [key, value] of Object.entries(qBank))
  {
    for (let i = 0; i < 5; i++)
    {
      value[0][i] = true;
    }
  }
  
  // Reset current player to no-one
  setCurrentPlayer(0);

  // Reset player points
  for (let i = 1; i <= 3; i++)
  {
    document.getElementById('player'+i+'Points').innerHTML = "0".bold();
  }
}

/*
Next question function
  Return to the spin screen with the wheel prepared to spin for the next category
*/
function nextQuestion(){
  answerDisplay.textContent = "";

  answerScreen.style.visibility = 'hidden';
  buzzInScreen.style.visibility = 'hidden';
  spinScreen.style.visibility = 'visible';
  answerTimer.style.visibility = 'hidden';
  // Reset answer buttons
  for (let i = 1; i < 5; i++)
  {
    document.getElementById("answer"+i+"Button").src = "assets/AnswerButton.png";
  }
  questionsLeftNumber.innerHTML = "<b>"+numQuestions+"</b>";
  EL_spin.innerHTML = "SPIN!".bold();
  EL_spin.style.cursor = "pointer";
  categoryDisplay.innerText = "";
}

/*
Shuffle function
  Used to randomize the order of answers to questions
*/
function shuffle(a, b)
{
  return Math.random() > 0.5 ? -1 : 1;
}

/*
Add points function
  Use a recursive setTimeout call to increase a player's point value by the current pointValue in an animated manner
*/
function addPoints(playerIndex, originalPoints)
{
  var playerPoints = document.getElementById("player"+playerIndex+"Points");
  if (parseInt(playerPoints.textContent) + 1 <= originalPoints + pointValue)
  {
    playerPoints.innerHTML = (parseInt(playerPoints.textContent) + 1).toString().bold();
    setTimeout(addPoints, 10, playerIndex, originalPoints);
  }
}

/*
Subtract points function
  Use a recursive setTimeout call to decrease a player's point value by the current pointValue in an animated manner
*/
function subtractPoints(playerIndex, originalPoints)
{
  adjustingPoints = true;
  var playerPoints = document.getElementById("player"+playerIndex+"Points");
  if (parseInt(playerPoints.textContent) - 1  >= originalPoints - pointValue)
  {
    playerPoints.textContent = (parseInt(playerPoints.textContent) - 1).toString();
    playerPoints.innerHTML = playerPoints.innerHTML.bold();
    setTimeout(subtractPoints, 10, playerIndex, originalPoints);
  }
}

/*
Set current player function
  Set all player icons to default except for the playerIndex player, whose icon will be the CurrentPlayerIcon
*/
function setCurrentPlayer(playerIndex)
{
  for (var i = 1; i <= 3; i++)
  {
    var playerIcon = document.getElementById("player"+i+"Icon");
    
    if (i == playerIndex)
    {
      playerIcon.src = "assets/CurrentPlayerIcon.png";
    }
    else
    {
      playerIcon.src = "assets/PlayerIcon.png";
    }
  }    
}

/*
Find winner function
  Determines which player has the most points.
  TO DO: Implement multiple winners, aka ties
*/
function findWinner()
{
  var winner = '';
  var winnerPoints = 0;
  for (let i = 1; i <= 3; i++)
  {
    var currPlayerPoints = Number(document.getElementById('player'+i+'Points').innerText);
    if (winner == '' || currPlayerPoints > winnerPoints)
    {
      winnerPoints = currPlayerPoints;
      winner = document.getElementById('player'+i+'Name').innerText
    }
  }
  return {winner, winnerPoints};
}

function getIndex()
{
  return Math.floor(tot - ang / TAU * tot) % tot;
}

function getConstants(){
  tot = sectors.length;
  EL_spin = document.querySelector("#spin");
  ctx = document.querySelector("#wheel").getContext('2d');
  dia = ctx.canvas.width;
  rad = dia / 2;
  PI = Math.PI;
  TAU = 2 * PI;
  arc = TAU / sectors.length;
}


/*
Randomize function
  Randomly pick 6 categories from the master questionBank and return it as the game's question bank.
*/
function randomize() {
  const questionBank = {
      "SOUNDS LIKE TENNIS": [
          [true, true, true, true, true],
          [
            'Ambrose Bierce defined it as "a temporary insanity curable by marriage"',
            "Likely spot for a potential earthquake",
            "The money you net from an investment",
            "In blackjack it can have one of 2 different values",
            "The operating expenses of running a business"
          ],
          [
            "love",
            "a fault",
            "a return",
            "ace",
            "overhead"
          ],
          [
            ["love", "hatred", "awkwardness", "shyness"],
            ["a fault", "a slope", "a berm", "a river"],
            ["a return", "a profit", "a gross", "a deduction"],
            ["ace", "king", "queen", "jack"],
            ["overhead", "payroll", "capital", "liabilities"]
          ]
      ],
      "THAT'S CANADIAN ENTERTAINMENT": [
          [true, true, true, true, true],
          [
            "This hip-hopper's love for Toronto is well known, & a 2018 report said about 5% of the city's annual tourism income was due to him",
            '"You Oughta Know" this Ottawa-born singer imported Flea & Dave Navarro to play on that song',
            'This Vancouver native lent his voice to the city\'s public transit in 2018; here\'s a sample: "Get those feet off the seat; my mom might be sitting there one day, come on"',
            'Canadians starring on this sketch show included Eugene Levy, Catherine O\'Hara & John Candy',
            'Eve on "Killing Eve", she considered studying journalism but went to Montreal\'s National Theatre School instead'
          ],
          [
            'Drake',
            'Alanis Morissette',
            'Seth Rogen',
            'Second City TV',
            'Sandra Oh'
          ],
          [
            ["Drake", "Eminem", "Kanye West", "Post Malone"],
            ["Alanis Morissette", "Celine Dion", "Jessie Reyez", "Nelly Furtado"],
            ["Seth Rogen", "Ryan Reynolds", "Michael J. Fox", "Michael Bublé"],
            ["Second City TV", "SNL Québec", "SketchCom", "Super Dave"],
            ["Sandra Oh", "Jodie Comer", "Fiona Shaw", "Gemma Whelan"]
          ]
      ],
      "TASTY BUSINESS": [
          [true, true, true, true, true],
          [
            "Developer Jef Raskin loved this type of apple so much he named an Apple computer after one",
            "BB is the stock symbol of this company that today is more into cybersecurity than devices",
            "Makes sense: BR Standard is a fashion line from this store",
            "Named for a green sushi condiment, this company calls itself \"the world's hottest cloud storage\"",
            "This restaurant chain says the only ingredient it uses that's hard to pronounce is the pepper in its name"
          ],
          [
            "a McIntosh",
            "BlackBerry",
            "Banana Republic",
            "Wasabi",
            "Chipotle"
          ],
          [
            ["a McIntosh", "a Fuji", "a Mutsu", "an Opal"],
            ["BlackBerry", "Bloomberg", "Best Buy", "BlueBird"],
            ["Banana Republic", "British Royale", "Blue Ridge", "Burlington Reserve"],
            ["Wasabi", "Shoyu", "Ichimi", "Karashi"],
            ["Chipotle", "Banana Republic", "Bojangles", "Chili\'s"]
          ]
      ],
      "SOMEBODY WROTE THAT": [
          [true, true, true, true, true],
          [
            "Melvina Young wrote the greeting card titled \"The Sisterhood\" for this company\'s \"Uplifted & Empowered\" collection",
            "Raymond K. Price Jr. wrote the first & last words of the Nixon presidency, his first inaugural address & this last public speech",
            "\"How Great\" is this beloved hymn that began as a Swedish poem by Carl Boberg & has been recorded by Carrie Underwood & Elvis",
            "Lynell George wrote the album notes for \"Otis Redding Live at\" this club on the Sunset Strip & won a Grammy for the effort",
            "Newspaper editor Francis Pharcellus Church wrote the 1897 reply to young Virginia O'Hanlon that's known by these 7 words"
          ],
          [
            "Hallmark Cards",
            "his Resignation",
            "How Great Thou Art",
            "the Whisky a Go Go",
            "Yes, Virginia, there is a Santa Claus"
          ],
          [
            ["Hallmark Cards", "American Greetings", "Quilling Cards", "Nobleworks"],
            ["his Resignation", "his State of the Union", "his Vietnam War address", "his National Energy Policy"],
            ["How Great Thou Art", "How Great the Spring Blooms", "How Great Our Love", "How Great Is God"],
            ["the Whisky a Go Go", "Ciro\'s", "the Mocambo", "the Trocadero"],
            ["Yes, Virginia, there is a Santa Claus", "Yes Virginia, there is an Easter Bunny", "Yes Virginia, there is a tooth fairy", "Yes Virginia, there is a Jack Frost"]
          ]
      ],
      "NO MAN": [
          [true, true, true, true, true],
          [
            "This Babylonian, not messing around with his \"code\": \"if a son strike his father, his hands shall be hewn off\"",
            "Andrew Volstead gave a big \"no\" with the National this act, which enforced the 18th Amendment",
            "On April 28, 1789 Fletcher Christian & crew said no to this captain's tough love, sending him off in a boat",
            "In this 1944 battle named for the shape of opposing lines, U.S. General Anthony McAuliffe replied \"Nuts!\" to a demand for surrender",
            "Dear Diary, in 1662 he was not a fan of \"A Midsummer Night\'s Dream\", \"which I had never seen before, nor shall ever again\""
          ],
          [
            "Hammurabi",
            "Prohibition",
            "Captain Bligh",
            "Battle of the Bulge",
            "Samuel Pepys"
          ],
          [
            ["Hammurabi", "Sharia", "Urukagina", "Gentoo"],
            ["Prohibition", "Slavery", "Voter Discrimination", "Income Tax"],
            ["Captain Bligh", "Captain Durham", "Captain Yorke", "Captain Rainier"],
            ["Battle of the Bulge", "Battle of Mill", "Battle of the Coral Sea", "Battle of Slim River"],
            ["Samuel Pepys", "Cyril Wyche", "John Dryden", "Hermann Ulrici"],
          ]
      ],
      "IS AN ISLAND": [
          [true, true, true, true, true],
          [
            "The Kanmon Undersea Tunnel connects Kyushu with this largest of the 4 main islands of Japan",
            "Take in the beauty of Hanauma Bay on this island, also known for the totally awesome waves on its North Shore",
            "One third of Earth's lava flow since 1500 is said to have come from volcanoes in this Atlantic island nation",
            "Brunei & the 13,500-foot Mount Kinabalu are on this large island that lies on the equator",
            "Once called Mount Victoria, Tomanivi on Viti Levu is the highest point in this nation"
          ],
          [
            "Honshu",
            "Oahu",
            "Iceland",
            "Borneo",
            "Fiji"
          ],
          [
            ["Honshu", "Hokkaido", "Shikoku", "Kyushu"],
            ["Oahu", "Maui", "Lanai", "Kauai"],
            ["Iceland", "Greenland", "Newfoundland", "Iwo Jima"],
            ["Borneo", "Tarawa", "Waigeo", "Bioko"],
            ["Fiji", "Nepal", "Peru", "Bolivia"],
          ]
      ],
      "FIRST DAY ON THE JOB": [
          [true, true, true, true, true],
          [
            "Getting used to the binoculars & keeping an eye out for rip currents are first-day tasks at this summer job",
            "One-word title of the job seen here: on your first day, don't be nervous, remember your glissando & fingering technique",
            "New at this gig, Neil Gorsuch embraced life on the cafeteria committee & having to open the door when someone knocks",
            "You've just got this gig assisting the mixologists; lots of lifting, so don't hurt the body part in the job's name",
            "You're the new court reporter, dazzle them with your fingers while you operate this intimidating machine"
          ],
          [
            "a lifeguard",
            "flautist",
            "a Supreme Court justice",
            "barback",
            "stenography machine"
          ],
          [
            ["a lifeguard", "a server", "a babysitter", "a golf caddy"],
            ["flautist", "pianist", "masseuse", "manicurist"],
            ["a Supreme Court justice", "a Congressman", "a Superintendent", "a University Dean"],
            ["barback", "chemist", "producer", "legislator"],
            ["stenography machine", "type writer", "computer", "tablet"]
          ]
      ],
      "FACTS ABOUT ANIMALS": [
          [true, true, true, true, true],
          [
            "The right or bowhead this gets tangled in fishing nets, which can stunt growth, causing the species to be shorter than its typical 52 feet",
            "The 2-toed one of these can live up to 20 years, most of it upside down in the canopy of the rainforest",
            "When faced with danger, certain ducks, snakes & mammals do this, also called thanatosis",
            "The kestrel is also known as this type of hawk, after the nice little bird it's looking around for here",
            "Sweden's only wild feline is this short-tailed cat that's able to bring down much larger animals, like reindeer & roe deer"
          ],
          [
            "a whale",
            "a sloth",
            "play dead",
            "sparrow hawk",
            "lynx"
          ],
          [
            ["a whale", "a giant squid", "a shark", "an octapus"],
            ["a sloth", "a koala bear", "a bat", "an orangutan"],
            ["play dead", "freeze", "run away", "attack"],
            ["sparrow hawk", "finch hawk", "starling hawk", "parrot hawk"],
            ["lynx", "bobcats", "servals", "ocelots"]
          ]
      ]
  };
  
  let roundBank = {};
  let roundCate = [];
  let categories = Object.keys(questionBank);
  const NUM_CATEGORIES_CHOSEN = 6;

  for (let i = NUM_CATEGORIES_CHOSEN; i > 0; i--) {
      let randomInt = Math.floor(Math.random() * i);
      roundBank[categories[randomInt]] = questionBank[categories[randomInt]];
      roundCate.push(categories[randomInt]);
      categories.splice(randomInt, 1);
  }

  let returnList = [roundBank, roundCate]
  return returnList;
};

/*
Draw sector function
  Used to actually draw the wheel sectors and fill with the category text
*/
function drawSector(sector, i, text) {
  getConstants();
  let ang = arc * i;
  ctx.save();
  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();
  // TEXT
  if (text)
  {
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(sector.label, rad - 10, 10);
    ctx.restore();
  }
};

/*
Rotate function
  Used to spin the wheel and display the chosen category. Sets up point value selection screen.
*/
function rotate() {
  EL_spin.textContent = "";
  let sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  EL_spin.style.background = sector.color;
  categoryDisplay.style.background = sector.color;
  if (wheelSpun) categoryDisplay.innerHTML = sector.label.bold();

  // Wheel has stopped spinning
  if (!angVel && wheelSpun)
  {
    sleep(1000);
    category = sector.label;
    pointValueScreen.style.visibility = 'visible';
    wheelSpun = false;
    for (var i = 1; i <= 5; i++)
    {
      var PVButton = document.getElementById("PVButton"+i);

      if (!qBank[category][0][i-1])
      {
        PVButton.src = "assets/UsedPointValueButton.png";
        PVButton.style.cursor = "default";
      }
      else
      {
        PVButton.src = "assets/UnusedPointValueButton.png";
        PVButton.style.cursor = "pointer";
      }
    }
  }
}

/*
Frame function
  Adjusts the angVel to slow the wheel and eventually stop the wheel.
*/
function frame() {
    if (!angVel) return;
    angVel *= friction; // Decrement velocity by friction
    if (angVel < 0.002) angVel = 0; // Bring to stop
    ang += angVel; // Update angle
    ang %= TAU; // Normalize angle
    rotate();
}

/*
Engine function
  The wheel's constant engine check to know to rotate when angVel is non-zero.
*/
function engine() {
    frame();
    requestAnimationFrame(engine)
}

/*
Empty check function
  Check whether a category is empty.
  *Not implemented yet*
*/
function isEmpty(category)
{
  var emptyCategory = true;
  for (let i = 0; i < 5; i++)
  {
    if (qBank[category][0][i])
    {
      emptyCategory = false;
      break;
    }
  }
  return emptyCategory;
}

function removeCategory()
{
  if (sectors.length > 1)
  {
    sectors.splice(getIndex(), 1);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    sectors.forEach(drawSector);
  }
  else
  {
    sectors = originalSectors;
    sectors.forEach(drawSector);
  }
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

  // Draw wheel
  sectors.forEach(drawSector);
  rotate(); // Initial rotation
  engine(); // Start engine
  if (!muted) themeMusic.play(); // Start lobby music

  //-------------------------Events-------------------------//

  // Mute Button Pressed
  muteButton.addEventListener('click', () => {
    muted = !muted;
    if (muted)
    {
      muteButton.src = "assets/Muted.png";
      buzzerAudio.pause();
      themeMusic.pause();
      jeopardyMusic.pause();
    }
    else
    {
      muteButton.src = "assets/Unmuted.png";
      if (connectScreen.style.visibility == 'visible' || lobbyScreen.style.visibility == 'visible')
      {
        themeMusic.volume = 0;
        fadeInAudio(themeMusic, 0.3);
      }
    }
  });

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

      document.getElementById("player1Name").innerHTML = "<b>"+username+"</b>";
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
    if (questionNumberInput.value > 0 && questionNumberInput.value <= 30) // Good input, continue
    {
      for (let i = 0; i < sectors.length; i++)
      {
        sectors[i].label = rCate[i];
      }
      sectors.forEach(drawSector);

      fadeOutAudio(themeMusic);

      // Swap to wheel spin screen
      numQuestions = questionNumberInput.value;
      errorQuestionNumber.style.visibility = "hidden";
      lobbyScreen.style.visibility = 'hidden';
      spinScreen.style.visibility = 'visible';
      EL_spin.innerHTML = "SPIN!".bold();
      EL_spin.style.cursor = "pointer";
      for (var i = 0; i < sectors.length; i++)
      {
        drawSector(sectors[i], i, true);
      }
      playerList.style.visibility = 'visible';
      questionsLeft.style.visibility = 'visible';

      questionsLeftNumber.innerHTML = "<b>"+numQuestions+"</b>";

      setCurrentPlayer(1); // This will need to change when implementing networking
    }
    else // Bad input, display error
    {
      errorQuestionNumber.style.visibility = "visible";
    }
  });

  // Spin Button Pressed
  EL_spin.addEventListener('click', () => {
    if (EL_spin.textContent == "SPIN!") // Validate the wheel can currently be spun
    {
      categoryDisplay.innerHTML = "";
      EL_spin.textContent == ""
      EL_spin.style.cursor = "default";

      // Enable PV buttons
      for (var i = 1; i <= 5; i++)
      {
        var currButton = document.getElementById("PVButton"+i);
        currButton.style.cursor = "pointer";
      }

      if (!angVel) // Make sure the wheel isn't already spinning
      {
        wheelSpun = true;
        angVel = rand(0.25, 0.35);
      }
    }
  });

  //----------Point Value Buttons----------//
  // PV1 Button Pressed
  PV1Button.addEventListener('click', () => {
    if (PV1Button.style.cursor == "pointer")
    {
      PV1Button.src = "assets/SelectedPointValueButton.png";
      pointValue = 10;

      buzzerButton.style.cursor = "pointer";

      // Disable PV buttons
      for (var i = 1; i <= 5; i++)
      {
        var currButton = document.getElementById("PVButton"+i);
        currButton.style.cursor = "default";
      }

      answerTimer.textContent = PVtimerLength;
      answerTimer.innerHTML = answerTimer.innerHTML.bold();
      setTimeout(decrementQuestionTimer, 1000, 0);
    }
  });
  // PV2 Button Pressed
  PV2Button.addEventListener('click', () => {
    if (PV2Button.style.cursor == "pointer")
    {
      PV2Button.src = "assets/SelectedPointValueButton.png";
      pointValue = 20;

      buzzerButton.style.cursor = "pointer";

      // Disable PV buttons
      for (var i = 1; i <= 5; i++)
      {
        var currButton = document.getElementById("PVButton"+i);
        currButton.style.cursor = "default";
      }

      answerTimer.textContent = PVtimerLength;
      answerTimer.innerHTML = answerTimer.innerHTML.bold();
      setTimeout(decrementQuestionTimer, 1000, 1);
    }
  });
  // PV3 Button Pressed
  PV3Button.addEventListener('click', () => {
    if (PV3Button.style.cursor == "pointer")
    {
      PV3Button.src = "assets/SelectedPointValueButton.png";
      pointValue = 30;

      buzzerButton.style.cursor = "pointer";

      // Disable PV buttons
      for (var i = 1; i <= 5; i++)
      {
        var currButton = document.getElementById("PVButton"+i);
        currButton.style.cursor = "default";
      }

      answerTimer.textContent = PVtimerLength;
      answerTimer.innerHTML = answerTimer.innerHTML.bold();
      setTimeout(decrementQuestionTimer, 1000, 2);
    }
  });
  // PV4 Button Pressed
  PV4Button.addEventListener('click', () => {
    if (PV4Button.style.cursor == "pointer")
    {
      PV4Button.src = "assets/SelectedPointValueButton.png";
      pointValue = 40;

      buzzerButton.style.cursor = "pointer";

      // Disable PV buttons
      for (var i = 1; i <= 5; i++)
      {
        var currButton = document.getElementById("PVButton"+i);
        currButton.style.cursor = "default";
      }

      answerTimer.textContent = PVtimerLength;
      answerTimer.innerHTML = answerTimer.innerHTML.bold();
      setTimeout(decrementQuestionTimer, 1000, 3);
    }
  });
  // PV5 Button Pressed
  PV5Button.addEventListener('click', () => {
    if (PV5Button.style.cursor == "pointer")
    {
      PV5Button.src = "assets/SelectedPointValueButton.png";
      pointValue = 50;

      buzzerButton.style.cursor = "pointer";

      // Disable PV buttons
      for (var i = 1; i <= 5; i++)
      {
        var currButton = document.getElementById("PVButton"+i);
        currButton.style.cursor = "default";
      }

      answerTimer.textContent = PVtimerLength;
      answerTimer.innerHTML = answerTimer.innerHTML.bold();
      setTimeout(decrementQuestionTimer, 1000, 4);
    }
  });

  // Buzz-In Button Pressed
  buzzerButton.addEventListener('click', () => {
    if (buzzerButton.style.cursor == "pointer")
    {
      buzzerAudio.currentTime = 0.1;
      if (!muted) buzzerAudio.play();

      buzzInScreen.style.visibility = 'hidden';
      answerScreen.style.visibility = 'visible';
      spinScreen.style.visibility = 'hidden';
      answerTimer.style.visibility = 'visible';

      qBank[category][0][(pointValue/10)-1] = false;

      numQuestions = numQuestions - 1;

      setCurrentPlayer(1);

      sleep(1000);

      questionAnswered = false;

      // Enable answer buttons
      for (var i = 1; i < 5; i++)
      {
        var currAnswer = document.getElementById("answer"+i+"Button");
        currAnswer.style.cursor = "pointer";
      }

      jeopardyMusic.currentTime = 0.5;
      if (!muted) jeopardyMusic.play();

      answerTimer.innerHTML = answerTimerLength.bold();
      setTimeout(decrementQuestionTimer, 1000, -1);
    }
  });

  //----------Answer Buttons----------//
  // Answer 1 Pressed
  answer1Button.addEventListener('click', () => {
    if (answer1Button.style.cursor == "pointer")
    {
      answerTimer.textContent = "1"; // Stop the timer so when we re-use it for the point value display, it won't glitch and halt the game
      jeopardyMusic.pause();
      if (answer1Text.innerHTML == correctAnswer)
      {
        applauseAudio.currentTime = 0.5;
        if (!muted) applauseAudio.play();
        answer1Button.src = "assets/CorrectAnswerButton.png";

        // Disable answer buttons
        for (var i = 1; i < 5; i++)
        {
          var currAnswer = document.getElementById("answer"+i+"Button");
          currAnswer.style.cursor = "default";
        }

        var playerIndex = 1;
        setTimeout(addPoints, 100, playerIndex, parseInt(document.getElementById("player"+playerIndex+"Points").textContent));
      }
      else
      {
        awwAudio.currentTime = 0.5;
        if (!muted) awwAudio.play();
        answer1Button.src = "assets/IncorrectAnswerButton.png";
        var playerIndex = 1;
        subtractPoints(playerIndex, parseInt(document.getElementById("player"+playerIndex+"Points").textContent));
        // Display correct answer and disable answer buttons
        for (var i = 1; i < 5; i++)
        {
          var currAnswer = document.getElementById("answer"+i+"Button");
          var currAnswerText = document.getElementById("answer"+i+"Text");
          currAnswer.style.cursor = "default";
          if (currAnswerText.textContent == correctAnswer)
          {
            currAnswer.src = "assets/CorrectAnswerButton.png";
          }
        }
      }
    }

    questionAnswered = true;

    if (isEmpty(category))
    {
      removeCategory();
    }

    buzzInTimer.innerHTML = "8";
    answerTimer.style.visibility = 'hidden';
    if (numQuestions > 0)
    {
      setTimeout(nextQuestion, 5000);
    }
    else
    {
      setTimeout(resetGame, 5000);
    }
  });
  // Answer 2 Pressed
  answer2Button.addEventListener('click', () => {
    if (answer2Button.style.cursor == "pointer")
    {
      answerTimer.textContent = "1"; // Stop the timer so when we re-use it for the point value display, it won't glitch and halt the game
      jeopardyMusic.pause();
      if (answer2Text.innerHTML == correctAnswer)
      {
        applauseAudio.currentTime = 0.5;
        if (!muted) applauseAudio.play();
        answer2Button.src = "assets/CorrectAnswerButton.png";

        // Disable answer buttons
        for (var i = 1; i < 5; i++)
        {
          var currAnswer = document.getElementById("answer"+i+"Text");
          currAnswer.style.cursor = "default";
        }
        
        var playerIndex = 1;
        addPoints(playerIndex, parseInt(document.getElementById("player"+playerIndex+"Points").textContent));
      }
      else
      {
        awwAudio.currentTime = 0.5;
        if (!muted) awwAudio.play();
        answer2Button.src = "assets/IncorrectAnswerButton.png";
        var playerIndex = 1;
        subtractPoints(playerIndex, parseInt(document.getElementById("player"+playerIndex+"Points").textContent));
        // Display correct answer and disable answer buttons
        for (var i = 1; i < 5; i++)
        {
          var currAnswer = document.getElementById("answer"+i+"Button");
          var currAnswerText = document.getElementById("answer"+i+"Text");
          currAnswer.style.cursor = "default";
          if (currAnswerText.textContent == correctAnswer)
          {
            currAnswer.src = "assets/CorrectAnswerButton.png";
          }
        }
      }
    }

    questionAnswered = true;

    if (isEmpty(category))
    {
      removeCategory();
    }

    buzzInTimer.innerHTML = "8";
    answerTimer.style.visibility = 'hidden';
    if (numQuestions > 0)
    {
      setTimeout(nextQuestion, 5000);
    }
    else
    {
      setTimeout(resetGame, 5000);
    }
  });
  // Answer 3 Pressed
  answer3Button.addEventListener('click', () => {
    if (answer3Button.style.cursor == "pointer")
    {
      answerTimer.textContent = "1"; // Stop the timer so when we re-use it for the point value display, it won't glitch and halt the game
      jeopardyMusic.pause();
      if (answer3Text.innerHTML == correctAnswer)
      {
        applauseAudio.currentTime = 0.5;
        if (!muted) applauseAudio.play();
        answer3Button.src = "assets/CorrectAnswerButton.png";

        // Disable answer buttons
        for (var i = 1; i < 5; i++)
        {
          var currAnswer = document.getElementById("answer"+i+"Text");
          currAnswer.style.cursor = "default";
        }
        
        var playerIndex = 1;
        addPoints(playerIndex, parseInt(document.getElementById("player"+playerIndex+"Points").textContent));
      }
      else
      {
        awwAudio.currentTime = 0.5;
        if (!muted) awwAudio.play();
        answer3Button.src = "assets/IncorrectAnswerButton.png";
        var playerIndex = 1;
        subtractPoints(playerIndex, parseInt(document.getElementById("player"+playerIndex+"Points").textContent));
        // Display correct answer and disable answer buttons
        for (var i = 1; i < 5; i++)
        {
          var currAnswer = document.getElementById("answer"+i+"Button");
          var currAnswerText = document.getElementById("answer"+i+"Text");
          currAnswer.style.cursor = "default";
          if (currAnswerText.textContent == correctAnswer)
          {
            currAnswer.src = "assets/CorrectAnswerButton.png";
          }
        }
      }
    }

    questionAnswered = true;

    if (isEmpty(category))
    {
      removeCategory();
    }

    buzzInTimer.innerHTML = "8";
    answerTimer.style.visibility = 'hidden';
    if (numQuestions > 0)
    {
      setTimeout(nextQuestion, 5000);
    }
    else
    {
      setTimeout(resetGame, 5000);
    }
  });
  // Answer 4 Pressed
  answer4Button.addEventListener('click', () => {
    if (answer4Button.style.cursor == "pointer")
    {
      answerTimer.textContent = "1"; // Stop the timer so when we re-use it for the point value display, it won't glitch and halt the game
      jeopardyMusic.pause();
      if (answer4Text.innerHTML == correctAnswer)
      {
        applauseAudio.currentTime = 0.5;
        if (!muted) applauseAudio.play();
        answer4Button.src = "assets/CorrectAnswerButton.png";

        // Disable answer buttons
        for (var i = 1; i < 5; i++)
        {
          var currAnswer = document.getElementById("answer"+i+"Text");
          currAnswer.style.cursor = "default";
        }
        
        var playerIndex = 1;
        addPoints(playerIndex, parseInt(document.getElementById("player"+playerIndex+"Points").textContent));
      }
      else
      {
        awwAudio.currentTime = 0.5;
        if (!muted) awwAudio.play();
        answer4Button.src = "assets/IncorrectAnswerButton.png";
        var playerIndex = 1;
        subtractPoints(playerIndex, parseInt(document.getElementById("player"+playerIndex+"Points").textContent));
        // Display correct answer and disable answer buttons
        for (var i = 1; i < 5; i++)
        {
          var currAnswer = document.getElementById("answer"+i+"Button");
          var currAnswerText = document.getElementById("answer"+i+"Text");
          currAnswer.style.cursor = "default";
          if (currAnswerText.textContent == correctAnswer)
          {
            currAnswer.src = "assets/CorrectAnswerButton.png";
          }
        }
      }
    }

    questionAnswered = true;

    if (isEmpty(category))
    {
      removeCategory();
    }

    buzzInTimer.innerHTML = "8";
    answerTimer.style.visibility = 'hidden';
    if (numQuestions > 0)
    {
      setTimeout(nextQuestion, 5000);
    }
    else
    {
      setTimeout(resetGame, 5000);
    }
  });

})();
