(function() {
  const connectScreenButton = document.querySelector('.connectButton');
  const playButton = document.querySelector('.playButton');
  const spinButton = document.querySelector('.spinButton');
  const wheel = document.querySelector('.wheel');
  
  // Initialize to connect screen
  document.getElementById("alwaysVisible").style.visibility = 'visible';
  document.getElementById("connectScreen").style.visibility = 'visible';
  document.getElementById("alwaysVisibleInGame").style.visibility = 'hidden';
  document.getElementById("lobbyScreen").style.visibility = 'hidden';
  document.getElementById("spinScreen").style.visibility = 'hidden';

  // Connect Button Pressed
  connectScreenButton.addEventListener('click', () => {
    document.getElementById("connectScreen").style.visibility = 'hidden';
    document.getElementById("lobbyScreen").style.visibility = 'visible';
    document.getElementById("alwaysVisibleInGame").style.visibility = 'visible';
  });

  // Play Button Pressed
  playButton.addEventListener('click', () => {
    document.getElementById("lobbyScreen").style.visibility = 'hidden';
    document.getElementById("spinScreen").style.visibility = 'visible';
    document.getElementById("alwaysVisibleInGame").style.visibility = 'visible';
  });

  // Spin Button Pressed
  spinButton.addEventListener('click', () => {
    document.getElementById("connectScreen").style.visibility = 'visible';
    document.getElementById("alwaysVisibleInGame").style.visibility = 'visible';
    document.getElementById("lobbyScreen").style.visibility = 'hidden';
    document.getElementById("spinScreen").style.visibility = 'hidden';
    document.getElementById("alwaysVisibleInGame").style.visibility = 'hidden';
  });
  
})();
