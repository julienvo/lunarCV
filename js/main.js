	var gravite = 0.01;

  var keyEvent = {
    gauche: false,
    droite: false,
    haut: false
  }

  window.addEventListener('load', function(event){
    var canvas = document.getElementById('canvas');
    window.onkeydown = function(event){
      var code = event.keyCode;
      switch(code){
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
     };
   };

   window.onkeyup = function(event){
     event.preventDefault();
     var code = event.keyCode;
     switch(code){            
      case 13:
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
    };
  };

  var updateGame = function(){
    if(!vaisseau.crash){
      updateVaisseau();
    }
    window.document.querySelector('#debug').innerHTML = 'PosX: ' + Math.floor(vaisseau.posX) + ' - PosY : ' + Math.floor(vaisseau.posY) + ' - Alt : ' + ((vaisseau.posY - 5) - terrain[Math.floor(mod(vaisseau.posX,cfgTerrain.width))]) + ' - velX : ' + Math.floor(vaisseau.velX * 10) + ' - velY : ' + Math.floor(vaisseau.velY * 10) + '<br/> offsetX : ' + camera.offsetX + ' - offsetY : ' + camera.offsetY + ' - offZoomY : ' + (vaisseau.posY - (vaisseau.posY + camera.offsetY) / camera.facteurZoom);
    updateCamera();
    render(canvas);
    requestAnimationFrame(updateGame);
  };

  var startGame = function(){
    initializeTerrain();
    generateTerrain(0, cfgTerrain.width -1, cfgTerrain.variance, cfgTerrain.amorti, 20);
    generatePlateformes(cfgTerrain.nbPlateformes);
    vaisseau.posX = plateformes[0] + 8;
    camera.offsetX = plateformes[0] - 150;
    render(canvas);
  };

  startGame();
  updateGame();

});