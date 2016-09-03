	var gravite = 0.01;
  var absX = 0;
  var absY = 0;

  var keyEvent = {
    gauche: false,
    droite: false,
    haut: false
  }

  window.addEventListener('load', function(event){
    var canvas = document.getElementById('canvas');
    window.onkeydown = function(event){
      var code = event.keyCode;
      event.preventDefault();
      switch(code){
       case 37:
       keyEvent.gauche = true;

       break;
       case 38:
       keyEvent.haut = true;

       break;
       case 39:
       keyEvent.droite = true;

       break;
       case 40:

       break;

       case 13:
       break;

       case 116:
       location.reload();

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
    window.document.querySelector('#debug').innerHTML = 'PosX: ' + Math.floor(vaisseau.posX) + ' - PosY : ' + Math.floor(canvas.height - vaisseau.posY) + ' - Alt : ' + ((canvas.height - vaisseau.posY - 5 - absY) - terrain[Math.floor(mod(vaisseau.posX + absX,cfg.width))]) + ' - velX : ' + Math.floor(vaisseau.velX * 10) + ' - velY : ' + Math.floor(vaisseau.velY * 10) + '<br/> absX : ' + absX + ' - absY : ' + absY;
    render(canvas);
    requestAnimationFrame(updateGame);
  };

  var startGame = function(){
    initializeTerrain();
    generateTerrain(0, cfg.width -1, cfg.variance, cfg.amorti, 20);
    generatePlateformes(cfg.nbPlateformes);
    render(canvas);
  };

  startGame();
  updateGame();

});