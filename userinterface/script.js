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
  const categoryDisplay = document.getElementById('categoryDisplay');
  var usernameInput = document.getElementById("usernameInput");
  var PVDisplayText = document.getElementById("PVDisplayText");
  var PVDisplayText2 = document.getElementById("PVDisplayText2");
  var buzzerButton = document.getElementById('buzzerButton');
  var buzzInTimer = document.getElementById('buzzInTimer');
  var answerTimer = document.getElementById('answerTimer');
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

  var category;
  var correctAnswer;

  // Timer Lengths
  const buzzInTimerLength = 9;
  const answerTimerLength = 15;

  // Wheel variables
  const initializedBank = randomize();
  const qBank = initializedBank[0];
  const rCate = initializedBank[1];
  var wheelSpun = false;

  const sectors = [{
    color: "#fff000",
    label: rCate[0]
  },
  {
    color: "#00cd22",
    label: rCate[1]
  },
  {
    color: "#c84fff",
    label: rCate[2]
  },
  {
    color: "#0095fe",
    label: rCate[3]
  },
  {
    color: "#fe0000",
    label: rCate[4]
  },
  {
    color: "#fe6900",
    label: rCate[5]
  },
];

const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const EL_spin = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext('2d');
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;
const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians
const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;

  //-------------------------Functions-------------------------//

  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  function decrementBuzzInTimer(){
    buzzInTimer.innerHTML = (parseInt(buzzInTimer.innerText) - 1).toString().bold();
    if (parseInt(buzzInTimer.innerText) > 0)
    {
      setTimeout(decrementBuzzInTimer, 1000);
    }
  }

  function decrementQuestionTimer(){
    answerTimer.innerHTML = (parseInt(answerTimer.innerText) - 1).toString().bold();
    if (parseInt(answerTimer.innerText) > 0)
    {
      setTimeout(decrementQuestionTimer, 1000);
    }
  }

  function viewCorrectAnswerTimer(){
    buzzInTimer.innerHTML = (parseInt(buzzInTimer.innerText) - 1).toString().bold();
    if (parseInt(buzzInTimer.innerText) > 0)
    {
      setTimeout(viewCorrectAnswerTimer, 1000);
    }
    else
    {
      if (numQuestions > 0)
      {
        setTimeout(nextQuestion, 1000);
      }
      else
      {
        setTimeout(resetGame, 1000);
      }
    }
  }

  function resetGame(){
    // Go to lobby screen with winner displayed
    answerScreen.style.visibility = 'hidden';
    lobbyScreen.style.visibility = 'visible';
    let {winner, winnerPoints} = findWinner();
    document.getElementById("winnerLabel").innerText = winner+" has won with "+winnerPoints+" points!";
    document.getElementById("playButton").src = "assets/PlayAgainButton.png";
    questionsLeft.style.visibility = 'hidden';
    categoryDisplay.innerText = "";
    // Reset answer buttons
    for (let i = 1; i < 5; i++)
    {
      document.getElementById("answer"+i+"Button").src = "assets/AnswerButton.png";
    }
  }

  function nextQuestion(){
    answerScreen.style.visibility = 'hidden';
    spinScreen.style.visibility = 'visible';
    // Reset answer buttons
    for (let i = 1; i < 5; i++)
    {
      document.getElementById("answer"+i+"Button").src = "assets/AnswerButton.png";
    }
    document.getElementById("questionsLeftNumber").innerHTML = "<b>"+numQuestions+"</b>";
    EL_spin.innerHTML = "SPIN!".bold();
    EL_spin.style.cursor = "pointer";
    categoryDisplay.innerText = "";
  }

  function shuffle(a, b)
  {
    return Math.random() > 0.5 ? -1 : 1;
  }

  function addPoints(points, playerIndex)
  {
    var playerPoints = document.getElementById("player"+playerIndex+"Points");
    playerPoints.innerHTML = (parseInt(playerPoints.innerText) + points).toString().bold();
  }

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
    return {winner, winnerPoints};
  }


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
              "his resignation",
              "How Great Thou Art",
              "the Whisky a Go Go",
              "Yes, Virginia, there is a Santa Claus"
            ],
            [
              ["Hallmark Cards", "American Greetings", "Quilling Cards", "Nobleworks"],
              ["his Resignation", "his State of the Union", "his Vietnam War address", "his National Energy Policy"],
              ["How Great Thou Art", "How Great the Spring Blooms", "How Great Our Love", "How Great Is Our God"],
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

  function drawSector(sector, i, text) {
    const ang = arc * i;
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

  function rotate() {
    EL_spin.textContent = "";
    const sector = sectors[getIndex()];
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

function frame() {
    if (!angVel) return;
    angVel *= friction; // Decrement velocity by friction
    if (angVel < 0.002) angVel = 0; // Bring to stop
    ang += angVel; // Update angle
    ang %= TAU; // Normalize angle
    rotate();
}

function engine() {
    frame();
    requestAnimationFrame(engine)
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
  for (var i = 0; i < sectors.length; i++)
  {
    drawSector(sectors[i], i, false);
  }
  rotate(); // Initial rotation
  engine(); // Start engine

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
    if (questionNumberInput.value > 0 && questionNumberInput.value <= 30)
    {
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

      document.getElementById("questionsLeftNumber").innerHTML = "<b>"+numQuestions+"</b>";
    }
    else
    {
      errorQuestionNumber.style.visibility = "visible";
    }
  });

  // Spin Button Pressed
  EL_spin.addEventListener('click', () => {
    if (EL_spin.textContent == "SPIN!")
    {
      categoryDisplay.innerHTML = "";
      EL_spin.textContent == ""
      EL_spin.style.cursor = "default";
      if (!angVel)
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
      pointValue = 10;
      pointValueScreen.style.visibility = 'hidden';
      buzzInScreen.style.visibility = 'visible';
      spinScreen.style.visibility = 'hidden';
      PVDisplayText.innerHTML = "<b>"+pointValue+"</b>";
      PVDisplayText2.innerHTML = "<b>"+pointValue+"</b>";
      var question = qBank[category][1][0];
      questionDisplay.innerHTML = "<b>"+question+"</b>";
      questionDisplay2.innerHTML = "<b>"+question+"</b>";

      var answers = qBank[category][3][0];
      correctAnswer = qBank[category][2][0];
      answers = answers.sort(shuffle);

      answer1Text.innerHTML = answers[0];
      answer2Text.innerHTML = answers[1];
      answer3Text.innerHTML = answers[2];
      answer4Text.innerHTML = answers[3];
      
      buzzInTimer.innerText = toString(buzzInTimerLength).bold();
      setTimeout(decrementBuzzInTimer, 1000);
    }
  });
  // PV2 Button Pressed
  PV2Button.addEventListener('click', () => {
    if (PV2Button.style.cursor == "pointer")
    {
      pointValue = 20;
      pointValueScreen.style.visibility = 'hidden';
      buzzInScreen.style.visibility = 'visible';
      spinScreen.style.visibility = 'hidden';
      PVDisplayText.innerHTML = "<b>"+pointValue+"</b>";
      PVDisplayText2.innerHTML = "<b>"+pointValue+"</b>";
      var question = qBank[category][1][1];
      questionDisplay.innerHTML = "<b>"+question+"</b>";
      questionDisplay2.innerHTML = "<b>"+question+"</b>";

      var answers = qBank[category][3][1];
      correctAnswer = qBank[category][2][1];
      answers = answers.sort(shuffle);

      answer1Text.innerHTML = answers[0];
      answer2Text.innerHTML = answers[1];
      answer3Text.innerHTML = answers[2];
      answer4Text.innerHTML = answers[3];

      buzzInTimer.innerText = toString(buzzInTimerLength).bold();
      setTimeout(decrementBuzzInTimer, 1000);
    }
  });
  // PV3 Button Pressed
  PV3Button.addEventListener('click', () => {
    if (PV3Button.style.cursor == "pointer")
    {
      pointValue = 30;
      pointValueScreen.style.visibility = 'hidden';
      buzzInScreen.style.visibility = 'visible';
      spinScreen.style.visibility = 'hidden';
      PVDisplayText.innerHTML = "<b>"+pointValue+"</b>";
      PVDisplayText2.innerHTML = "<b>"+pointValue+"</b>";
      var question = qBank[categoryDisplay.textContent][1][2];
      questionDisplay.innerHTML = "<b>"+question+"</b>";
      questionDisplay2.innerHTML = "<b>"+question+"</b>";

      var answers = qBank[category][3][2];
      correctAnswer = qBank[category][2][2];
      answers = answers.sort(shuffle);

      answer1Text.innerHTML = answers[0];
      answer2Text.innerHTML = answers[1];
      answer3Text.innerHTML = answers[2];
      answer4Text.innerHTML = answers[3];

      buzzInTimer.innerText = toString(buzzInTimerLength).bold();
      setTimeout(decrementBuzzInTimer, 1000);
    }
  });
  // PV4 Button Pressed
  PV4Button.addEventListener('click', () => {
    if (PV4Button.style.cursor == "pointer")
    {
      pointValue = 40;
      pointValueScreen.style.visibility = 'hidden';
      buzzInScreen.style.visibility = 'visible';
      spinScreen.style.visibility = 'hidden';
      PVDisplayText.innerHTML = "<b>"+pointValue+"</b>";
      PVDisplayText2.innerHTML = "<b>"+pointValue+"</b>";
      var question = qBank[categoryDisplay.textContent][1][3];
      questionDisplay.innerHTML = "<b>"+question+"</b>";
      questionDisplay2.innerHTML = "<b>"+question+"</b>";

      var answers = qBank[category][3][3];
      correctAnswer = qBank[category][2][3];
      answers = answers.sort(shuffle);

      answer1Text.innerHTML = answers[0];
      answer2Text.innerHTML = answers[1];
      answer3Text.innerHTML = answers[2];
      answer4Text.innerHTML = answers[3];

      buzzInTimer.innerText = toString(buzzInTimerLength).bold();
      setTimeout(decrementBuzzInTimer, 1000);
    }
  });
  // PV5 Button Pressed
  PV5Button.addEventListener('click', () => {
    if (PV5Button.style.cursor == "pointer")
    {
      pointValue = 50;
      pointValueScreen.style.visibility = 'hidden';
      buzzInScreen.style.visibility = 'visible';
      spinScreen.style.visibility = 'hidden';
      PVDisplayText.innerHTML = "<b>"+pointValue+"</b>";
      PVDisplayText2.innerHTML = "<b>"+pointValue+"</b>";
      var question = qBank[categoryDisplay.textContent][1][4];
      questionDisplay.innerHTML = "<b>"+question+"</b>";
      questionDisplay2.innerHTML = "<b>"+question+"</b>";

      var answers = qBank[category][3][4];
      correctAnswer = qBank[category][2][4];
      answers = answers.sort(shuffle);

      answer1Text.innerHTML = answers[0];
      answer2Text.innerHTML = answers[1];
      answer3Text.innerHTML = answers[2];
      answer4Text.innerHTML = answers[3];
      
      buzzInTimer.innerText = toString(buzzInTimerLength).bold();
      setTimeout(decrementBuzzInTimer, 1000);
    }
  });

  // Buzz-In Button Pressed
  buzzerButton.addEventListener('click', () => {
    buzzInScreen.style.visibility = 'hidden';
    answerScreen.style.visibility = 'visible';
    spinScreen.style.visibility = 'hidden';

    qBank[category][0][(pointValue/10)-1] = false;

    setCurrentPlayer(1);

    answerTimer.innerText = toString(answerTimerLength).bold();
    setTimeout(decrementQuestionTimer, 1000);
  });

  //----------Answer Buttons----------//
  // Answer 1 Pressed
  answer1Button.addEventListener('click', () => {
    if (answer1Text.innerHTML == correctAnswer)
    {
      answer1Button.src = "assets/CorrectAnswerButton.png";
      addPoints(pointValue, 1);
    }
    else
    {
      answer1Button.src = "assets/IncorrectAnswerButton.png";
      addPoints(-1*pointValue, 1);
      // Display correct answer
      for (var i = 1; i < 5; i++)
      {
        var currAnswer = document.getElementById("answer"+i+"Text");
        if (currAnswer.innerHTML == correctAnswer)
        {
          document.getElementById("answer"+i+"Button").src = "assets/CorrectAnswerButton.png";
          break;
        }
      }
    }

    buzzInTimer.innerHTML = "5";
    answerTimer.style.visibility = 'hidden';
    numQuestions = numQuestions - 1;
    setTimeout(viewCorrectAnswerTimer, 1000);
  });
  // Answer 2 Pressed
  answer2Button.addEventListener('click', () => {
    if (answer2Text.innerHTML == correctAnswer)
    {
      answer2Button.src = "assets/CorrectAnswerButton.png";
      addPoints(pointValue, 1);
    }
    else
    {
      answer2Button.src = "assets/IncorrectAnswerButton.png";
      addPoints(-1*pointValue, 1);
      // Display correct answer
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

    buzzInTimer.innerHTML = "5";
    answerTimer.style.visibility = 'hidden';
    numQuestions = numQuestions - 1;
    setTimeout(viewCorrectAnswerTimer, 1000);
  });
  // Answer 3 Pressed
  answer3Button.addEventListener('click', () => {
    if (answer3Text.innerHTML == correctAnswer)
    {
      answer3Button.src = "assets/CorrectAnswerButton.png";
      addPoints(pointValue, 1);
    }
    else
    {
      answer3Button.src = "assets/IncorrectAnswerButton.png";
      addPoints(-1*pointValue, 1);
      // Display correct answer
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

    buzzInTimer.innerHTML = "5";
    answerTimer.style.visibility = 'hidden';
    numQuestions = numQuestions - 1;
    setTimeout(viewCorrectAnswerTimer, 1000);
  });
  // Answer 4 Pressed
  answer4Button.addEventListener('click', () => {
    if (answer4Text.innerHTML == correctAnswer)
    {
      answer4Button.src = "assets/CorrectAnswerButton.png";
      addPoints(pointValue, 1);
    }
    else
    {
      answer4Button.src = "assets/IncorrectAnswerButton.png";
      addPoints(-1*pointValue, 1);
      // Display correct answer
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

    buzzInTimer.innerHTML = "5";
    answerTimer.style.visibility = 'hidden';
    numQuestions = numQuestions - 1;
    setTimeout(viewCorrectAnswerTimer, 1000);
  });

})();
