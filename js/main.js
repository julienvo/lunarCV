var keyEvent = {
  gauche: false,
  droite: false,
  haut: false,
  bas: false,
  entree: false
};

var timeStart, timeElapsed, compteurCompetences, compteurFrames;
var state = 'start';
var score = 8000;

window.addEventListener('load', function(event){
  var message = document.getElementById('message');
  var canvas = document.getElementById('canvas');
  var infos = document.getElementById('infos');

  window.onkeydown = function(event){
    // Stocke les 8 dernières touches entrées pour le cheat code :o
    var code = event.keyCode;
    lastKeys.shift();
    lastKeys.push(code);
    if(arraysEqual(lastKeys,cheatCode)){
      afficherIcones();
    }

    switch(code){
      case 32:
      event.preventDefault();
      if( state == 'crash'){ // Repart depuis un endroit sur, en gardant les compétences déjà acquises
        vaisseau.init(vaisseau.posX, terrain[Math.floor(mod(vaisseau.posX, cfgTerrain.width))] + 150, false);
        state = 'playing';
        hideMessage();
        updateGame();
      }
      else{
        if(state == 'gameOver'){ // Réinitialise complètement le jeu
          initGame();
        }
        startGame();
      }
      break;

      case 37:
      event.preventDefault();
      keyEvent.gauche = true;
      break;

      case 38:
      event.preventDefault();
      keyEvent.haut = true;
      break;

      case 39:
      event.preventDefault();
      keyEvent.droite = true;
      break;

      case 40:
      event.preventDefault();
      keyEvent.bas = true;
      break;
    };
  };

  window.onkeyup = function(event){
    event.preventDefault();
    var code = event.keyCode;
    switch(code){            
      case 37:
      keyEvent.gauche = false;
      break;
      case 38:
      thrust.pause();
      keyEvent.haut = false;
      break;
      case 39:
      keyEvent.droite = false;
      break;
      case 40:
      keyEvent.bas = false;
      break;
    };
  };

  var updateGame = function(){
    
    // Le score baisse avec le temps
    compteurFrames++;
    if(compteurFrames % 50 == 0){
      score -= 50;
    }

    // Message de victoire
    if(compteurCompetences == 10){
      showMessage('Vous avez gagné !!! <br /><br /> Vous pouvez désormais accéder à la version pdf de mon CV en cliquant sur le lien dans la navbar.');
      afficherIcones();
    }

    else if(!vaisseau.crash && state == 'playing'){
      updateVaisseau();

      // Si le vaisseau est sur une plateforme
      if(vaisseau.pose){
        // Si le vaisseau ne s'est pas encore posé sur la plateforme
        // on affiche la compétence correspondante sous le canvas
        if(vaisseau.currentPlatform.isActive){
          score += Math.max(Math.round(2000 * (1-(vaisseau.lastVelX - vaisseau.lastVelY))), 0);
          vaisseau.currentPlatform.isActive = false;
          var competence = document.querySelector('#'+competences[compteurCompetences]);
          competence.className = '';
          setTimeout(function(){competence.style.opacity = 1;}, 100);
          compteurCompetences++;
          scoreObj.init(vaisseau.posX, vaisseau.posY + 15, Math.max(Math.round(2000 * (1-(vaisseau.lastVelX - vaisseau.lastVelY))), 0));
        }
      }
      else{ // Le vaisseau ne peut pas tourner si il est posé sur une plateforme
        if(keyEvent.gauche){
          vaisseau.angle -= Math.PI/60;
        }
        if(keyEvent.droite){
          vaisseau.angle += Math.PI/60;
        }
      }

      if(keyEvent.haut){
        if(vaisseau.fuel > 0){
          vaisseau.acc = 0.0125;
          thrust.play();
        }
        else{
          vaisseau.acc = 0;
          thrust.pause();
        }
      }
      else{
        vaisseau.acc = 0;
        thrust.pause();
      }

      if(scoreObj.isActive){
        scoreObj.update();
      }
      timeElapsed = (Date.now() - timeStart);
      camera.update();
      renderGame(canvas);
      renderInfos(infos);
      requestAnimationFrame(updateGame);
    }
    else{ // crash :(
      boom.play();
      if(vaisseau.fuel > 0){ // try again
        state = 'crash';
        showMessage('Vous vous êtes crashé. Appuyez sur espace pour reprendre depuis un endroit sûr.');
        score -= 1000;
      }
      else{ // game over
        state = 'gameOver';
        showMessage('Vous n\'avez plus d\'essence, Game Over :( <br/><br/>Appuyez sur espace pour recommencer.');
      }
    }
  };

  var initGame = function(){  

    // Génération du terrain
    initializeTerrain();
    generateTerrain(0, cfgTerrain.width -1, cfgTerrain.variance, cfgTerrain.amorti);
    plateformes = generatePlateformes(cfgTerrain.nbPlateformes);
   
    // Génération du ciel
    generateSky(canvas.width, canvas.height, 1800);

    // Positionnement du vaisseau en haut et à gauche du point le plus haut
    // Et configuration de la limite basse de la caméra
    var extremites = extremePoints(terrain);
    vaisseau.init(extremites.highest.x - 300, extremites.highest.y + 200, true);
    camera.bottom = extremites.lowest.y - 50;
    camera.init(vaisseau.posX, vaisseau.posY);
    renderGame(canvas);
    renderInfos(infos);

    // Masquage des logos des compétences

    compteurCompetences = 0;
    var divs = document.querySelectorAll('#barreCompetences div');
    [].forEach.call(divs, function(div) {
      div.className += " hidden";
      div.style.opacity = 0;
    });

    // Affichage du message d'accueil
    showMessage('Appuyez sur espace pour jouer. <br/><br/>Pour accéder directement à mon CV, il suffit d\'entrer le code mystère. (Ou vous pouvez aussi appuyer sur le bouton à côté de mon nom.)');
  }

  var startGame = function(){
    if(!(state == 'playing')){
      state = 'playing';
      compteurFrames = 0;
      timeStart = Date.now();
      updateGame();
      hideMessage();
    }
  };

  // Initialise les taille des canvas et initialise le jeu
  canvas.height = window.innerHeight - 238;
  infos.height = 82;
  infos.width = document.body.clientWidth;
  canvas.width = document.body.clientWidth;
  initGame();
});