(function() {
  const wheel = document.querySelector('.wheel');
  const startButton = document.querySelector('.button');
  const display = document.querySelector('.display');
  
  let deg = 0;
  let zoneSize = 60;

  const handleWin = (actualDeg) => {
    let winningSymbol = '';
    if ((actualDeg < 30) || (actualDeg >= 330)) {
      winningSymbol = "Green";
    }
    if ((actualDeg >= 30) && (actualDeg < 90)){
      winningSymbol = "Yellow";
    }
    if ((actualDeg >= 90) && (actualDeg < 150)){
      winningSymbol = "Orange";
    }
    if ((actualDeg >= 150) && (actualDeg < 210)){
      winningSymbol = "Red";
    }
    if ((actualDeg >= 210) && (actualDeg < 270)){
      winningSymbol = "Purple";
    }
    if ((actualDeg >= 270) && (actualDeg < 330)){
      winningSymbol = "Blue";
    }

    display.innerHTML = winningSymbol;
  }

  startButton.addEventListener('click', () => {
    display.innerHTML = "-";
    startButton.style.pointerEvents = 'none';
    let spin_var = 0;
    let min = Math.ceil(100);
    let max = Math.floor(5000);
    spin_var = Math.floor(Math.random() * (max - min) + min);
    deg = Math.floor(spin_var + Math.random() * spin_var);
    wheel.style.transition = 'all 10s ease-out';
    wheel.style.transform = `rotate(${deg}deg)`;
    wheel.classList.add('blur');
  });

  wheel.addEventListener('transitionend', () => {
    wheel.classList.remove('blur');
    startButton.style.pointerEvents = 'auto';
    wheel.style.transition = 'none';
    const actualDeg = (deg % 360);
    wheel.style.transform = `rotate(${actualDeg}deg)`;
    handleWin(actualDeg);
  });
})();
