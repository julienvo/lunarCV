var keyEvent = {
  gauche: false,
  droite: false,
  haut: false,
  bas: false,
  entree: false
};

var timeStart, timeElapsed, compteur;
var state = 'start'

window.addEventListener('load', function(event){
  var message = document.getElementById('message');
  var canvas = document.getElementById('canvas');
  var infos = document.getElementById('infos');

  window.onkeydown = function(event){
    var code = event.keyCode;
    switch(code){
      case 13:
      event.preventDefault();
      keyEvent.entree = true;
      break;
      case 32:
      event.preventDefault();
      if(state == 'gameOver'){
        initGame();
      }
      startGame();
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
    };
  };

  window.onkeyup = function(event){
    event.preventDefault();
    var code = event.keyCode;
    switch(code){            
      case 13:
      keyEvent.entree = false;
      break;
      case 37:
      keyEvent.gauche = false;
      break;
      case 38:
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

  if(!vaisseau.crash && state == 'playing'){
    updateVaisseau();

    // Si le vaisseau est sur une plateforme
    if(vaisseau.pose){
      // Si le vaisseau ne s'est pas encore posé sur la plateforme
      // on affiche la compétence correspondante sous le canvas

      if(vaisseau.currentPlatform.isActive){
        console.log('posayToutNeuf');
        vaisseau.currentPlatform.isActive = false;
        let competence = document.getElementById(competences[compteur]);
        competence.classList.remove('hidden');
        setTimeout(function(){competence.style.opacity = 1;}, 100);
        compteur++;

        /* LOGIQUE D'AFFICHAGE DES COMPETENCES */

      }



    }
    else{
      if(keyEvent.gauche){
        vaisseau.angle -= Math.PI/60;
      }
      if(keyEvent.droite){
        vaisseau.angle += Math.PI/60;
      }
    }
    vaisseau.acc = (keyEvent.haut) ? 0.0125 : 0;

    //if(keyEvent.gauche){
    //  camera.offsetX--;
    //}
    //if(keyEvent.droite){
    //  camera.offsetX++;
    //}
    //if(keyEvent.haut){
    //  camera.offsetY++;
    //}
    //if(keyEvent.bas){
    //  camera.offsetY--;
    //}
    //if(keyEvent.entree){
    //  if(camera.facteurZoom == 1){
    //    camera.facteurZoom  = 2;
    //  }
    //  else camera.facteurZoom = 1;
    //}


    timeElapsed = (Date.now() - timeStart);
    window.document.querySelector('#debug').innerHTML = 'PosX: ' + Math.floor(vaisseau.posX) + ' - PosY : ' + Math.floor(vaisseau.posY) + ' - Alt : ' + Math.floor(((vaisseau.posY - 5) - terrain[Math.floor(mod(vaisseau.posX,cfgTerrain.width))])) + ' - velX : ' + Math.floor(vaisseau.velX * 10) + ' - velY : ' + Math.floor(vaisseau.velY * 10) + '<br/> offsetX : ' + Math.floor(camera.offsetX) + ' - offsetY : ' + Math.floor(camera.offsetY) + ' - posYRel : ' + Math.floor(canvas.height - (vaisseau.posY) * camera.facteurZoom) + ' - posTerrainZoom : ' + Math.floor(((canvas.height - (terrain[mod(Math.floor(vaisseau.posX),cfgTerrain.width)]))));
    camera.update();
    renderGame(canvas);
    renderInfos(infos);
    requestAnimationFrame(updateGame);
  }
  else{
    state = 'gameOver';
    message.innerHTML = 'You died.<br/><br/>(noob.) <br/><br/>Press Space to restart';
    message.style.display = 'block';
  }
};

var initGame = function(){  

  // génération du terrain
  initializeTerrain();
  generateTerrain(0, cfgTerrain.width -1, cfgTerrain.variance, cfgTerrain.amorti, 20);
  plateformes = generatePlateformes(cfgTerrain.nbPlateformes);

  // Positionnement du vaisseau en haut et à gauche du point le plus haut
  // Et configuration de la limite basse de la caméra
  let extremites = extremePoints(terrain);
  vaisseau.init(extremites.highest.x - 300, extremites.highest.y + 200);
  camera.bottom = extremites.lowest.y - 50;
  camera.init(vaisseau.posX, vaisseau.posY);
  renderGame(canvas);
  renderInfos(infos);

  //

  message.innerHTML = 'Press Space to start';
  message.style.display = 'block';

}

var startGame = function(){
  console.log(!(state == 'playing'));
  if(!(state == 'playing')){
    state = 'playing';
    compteur = 0;
    timeStart = Date.now();
    updateGame();
    message.style.display = 'none';
  }
};


canvas.height = window.innerHeight - 270;
infos.height = 82;
infos.width = document.body.clientWidth;
canvas.width = document.body.clientWidth;
initGame();

});