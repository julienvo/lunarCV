var keyEvent = {
  gauche: false,
  droite: false,
  haut: false,
  bas: false,
  entree: false
};

var timeStart, timeElapsed;

window.addEventListener('load', function(event){
  var canvas = document.getElementById('canvas');
  var infos = document.getElementById('infos');

  window.onkeydown = function(event){
    var code = event.keyCode;
    switch(code){

      case 13:
      event.preventDefault();
      keyEvent.entree = true;
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
  if(!vaisseau.crash){
    timeElapsed = (Date.now() - timeStart)


    updateVaisseau();
  
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


    window.document.querySelector('#debug').innerHTML = 'PosX: ' + Math.floor(vaisseau.posX) + ' - PosY : ' + Math.floor(vaisseau.posY) + ' - Alt : ' + Math.floor(((vaisseau.posY - 5) - terrain[Math.floor(mod(vaisseau.posX,cfgTerrain.width))])) + ' - velX : ' + Math.floor(vaisseau.velX * 10) + ' - velY : ' + Math.floor(vaisseau.velY * 10) + '<br/> offsetX : ' + Math.floor(camera.offsetX) + ' - offsetY : ' + Math.floor(camera.offsetY) + ' - posYRel : ' + Math.floor(canvas.height - (vaisseau.posY) * camera.facteurZoom) + ' - posTerrainZoom : ' + Math.floor(((canvas.height - (terrain[mod(Math.floor(vaisseau.posX),cfgTerrain.width)]))));
    camera.update();
    renderGame(canvas);
    renderInfos(infos);
    requestAnimationFrame(updateGame);
  }
};

var startGame = function(){
  timeStart = Date.now();
  infos.width = window.innerWidth;
  infos.height = 100;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 200;

  // génération du terrain
  initializeTerrain();
  generateTerrain(0, cfgTerrain.width -1, cfgTerrain.variance, cfgTerrain.amorti, 20);
  generatePlateformes(cfgTerrain.nbPlateformes);

  // Positionnement du vaisseau en haut et à gauche du point le plus haut
  // Et configuration de la limite basse de la caméra
  let extremites = extremePoints(terrain);
  vaisseau.init(extremites.highest.x - 300, extremites.highest.y + 200);
  camera.bottom = extremites.lowest.y - 50;
  camera.init(vaisseau.posX, vaisseau.posY);

  console.log(Math.floor(extremites.highest.y - extremites.lowest.y));
//    vaisseau.posX = plateformes[0] + 8;
//    camera.offsetX = plateformes[0] - 150;
//    camera.offsetY = 400;
  renderGame(canvas);
  renderInfos(infos);
};

startGame();
updateGame();

});