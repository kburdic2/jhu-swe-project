function randomize() {
    const questionBank = {
        "SOUNDS LIKE TENNIS": [
            [true, true, true, true, true],
            ['Ambrose Bierce defined it as "a temporary insanity curable by marriage"',
                "Spot for a potential earthquake",
                "The money you net from an investment",
                "In blackjack it can have one of 2 different values",
                "The operating expenses of running a business"
            ],
            ["love",
                "a fault",
                "a return",
                "ace",
                "overhead"
            ]
        ],
        "THAT'S CANADIAN ENTERTAINMENT": [
            [true, true, true, true, true],
            ["This hip-hopper's love for Toronto is well known, & a 2018 report said about 5% of the city's annual tourism income was due to him",
                '"You Oughta Know" this Ottawa-born singer imported Flea & Dave Navarro to play on that song',
                'This Vancouver native lent his voice to the city\'s public transit in 2018; here\'s a sample: "Get those feet off the seat; my mom might be sitting there one day, come on"',
                'Canadians starring on this sketch show included Eugene Levy, Catherine O\'Hara & John Candy',
                'Eve on "Killing Eve", she considered studying journalism but went to Montreal\'s National Theatre School instead'
            ],
            ['Drake',
                'Alanis Morissette',
                'Seth Rogen',
                'SCTV (Second City TV)',
                '(Sandra) Oh'
            ]
        ],
        "TASTY BUSINESS": [
            [true, true, true, true, true],
            ["Developer Jef Raskin loved this type of apple so much he named an Apple computer after one",
                "BB is the stock symbol of this company that today is more into cybersecurity than devices",
                "Makes sense: BR Standard is a fashion line from this store",
                "Named for a green sushi condiment, this company calls itself \"the world's hottest cloud storage\"",
                "This restaurant chain says the only ingredient it uses that's hard to pronounce is the pepper in its name"
            ],
            ["a McIntosh",
                "BlackBerry",
                "Banana Republic",
                "Wasabi",
                "Chipotle"
            ]
        ],
        "SOMEBODY WROTE THAT": [
            [true, true, true, true, true],
            ["Melvina Young wrote the greeting card titled \"The Sisterhood\" for this company\'s \"Uplifted & Empowered\" collection",
                "Raymond K. Price Jr. wrote the first & last words of the Nixon presidency, his first inaugural address & this last public speech",
                "\"How Great\" is this beloved hymn that began as a Swedish poem by Carl Boberg & has been recorded by Carrie Underwood & Elvis",
                "Lynell George wrote the album notes for \"Otis Redding Live at\" this club on the Sunset Strip & won a Grammy for the effort",
                "Newspaper editor Francis Pharcellus Church wrote the 1897 reply to young Virginia O'Hanlon that's known by these 7 words"
            ],
            ["Hallmark",
                "his resignation",
                '"How Great Thou Art"',
                "the Whisky a Go Go",
                "Yes, Virginia, there is a Santa Claus"
            ]
        ],
        "NO MAN": [
            [true, true, true, true, true],
            ["This Babylonian, not messing around with his \"code\": \"if a son strike his father, his hands shall be hewn off\"",
                "Andrew Volstead gave a big \"no\" with the National this act, which enforced the 18th Amendment",
                "On April 28, 1789 Fletcher Christian & crew said no to this captain's tough love, sending him off in a boat",
                "In this 1944 battle named for the shape of opposing lines, U.S. General Anthony McAuliffe replied \"Nuts!\" to a demand for surrender",
                "Dear Diary, in 1662 he was not a fan of \"A Midsummer Night\'s Dream\", \"which I had never seen before, nor shall ever again\""
            ],
            ["Hammurabi",
                "Prohibition",
                "(Captain) Bligh",
                "Battle of the Bulge",
                "(Samuel) Pepys"
            ]
        ],
        "IS AN ISLAND": [
            [true, true, true, true, true],
            ["The Kanmon Undersea Tunnel connects Kyushu with this largest of the 4 main islands of Japan",
                "Take in the beauty of Hanauma Bay on this island, also known for the totally awesome waves on its North Shore",
                "One third of Earth's lava flow since 1500 is said to have come from volcanoes in this Atlantic island nation",
                "Brunei & the 13,500-foot Mount Kinabalu are on this large island that lies on the equator",
                "Once called Mount Victoria, Tomanivi on Viti Levu is the highest point in this nation"
            ],
            ["Honshu",
                "Oahu",
                "Iceland",
                "Borneo",
                "Fiji"
            ]
        ],
        "FIRST DAY ON THE JOB": [
            [true, true, true, true, true],
            ["Getting used to the binoculars & keeping an eye out for rip currents are first-day tasks at this summer job",
                "One-word title of the job seen here: on your first day, don't be nervous, remember your glissando & fingering technique",
                "New at this gig, Neil Gorsuch embraced life on the cafeteria committee & having to open the door when someone knocks",
                "You've just got this gig assisting the mixologists; lots of lifting, so don't hurt the body part in the job's name",
                "You're the new court reporter, dazzle them with your fingers while you operate this intimidating machine"
            ],
            ["a lifeguard",
                "flautist",
                "a Supreme Court justice",
                "barback",
                "stenography machine"
            ]
        ],
        "FACTS ABOUT ANIMALS": [
            [true, true, true, true, true],
            ["The right or bowhead this gets tangled in fishing nets, which can stunt growth, causing the species to be shorter than its typical 52 feet",
                "The 2-toed one of these can live up to 20 years, most of it upside down in the canopy of the rainforest",
                "When faced with danger, certain ducks, snakes & mammals do this, also called thanatosis",
                "The kestrel is also known as this type of hawk, after the nice little bird it's looking around for here",
                "Sweden's only wild feline is this short-tailed cat that's able to bring down much larger animals, like reindeer & roe deer"
            ],
            [
                "a whale",
                "a sloth",
                "play dead",
                "(the) sparrow (hawk)",
                "lynx"
            ]
        ]
    };

    let categories = ["SOUNDS LIKE TENNIS", "THAT'S CANADIAN ENTERTAINMENT", "TASTY BUSINESS", "SOMEBODY WROTE THAT", "NO MAN", "IS AN ISLAND", "FIRST DAY ON THE JOB", "FACTS ABOUT ANIMALS"];
    let num = 7;
    let roundBank = {};
    let roundCate = [];

    while (num > 1) {
        let randomInt = Math.floor(Math.random() * num);
        roundBank[categories[randomInt]] = questionBank[categories[randomInt]];
        roundCate.push(categories[randomInt]);
        categories.splice(randomInt, 1);
        num -= 1;
    }

    let returnList = [roundBank, roundCate]
    return returnList;
};

const initializedBank = randomize();
const qBank = initializedBank[0];
const rCate = initializedBank[1];

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

function drawSector(sector, i) {
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
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(sector.label, rad - 10, 10);
    ctx.restore();
};

function rotate() {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    EL_spin.textContent = sector.label;
    EL_spin.style.background = sector.color;
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

// INIT
sectors.forEach(drawSector);
rotate(); // Initial rotation
engine(); // Start engine
EL_spin.textContent = "SPIN!";
EL_spin.addEventListener("click", () => {
    if (!angVel) angVel = rand(0.25, 0.35);
});
