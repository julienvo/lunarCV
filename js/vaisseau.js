var vaisseau = {
  fuel: 400,
  posX: 0,
  posY: 0,
  angle: 0,
  velX: 0,
  velY: 0,
  acc: 0,
  crash: false,
  pose: false,
  currentPlatform: null,
  vlimX: 1,
  vlimY: 1.5,
  init: function(x, y){
    this.posX = x;
    this.posY = y;
  }
};


// Retourne la plateforme sur laquelle le vaisseau est posé
// Retourne null si le vaisseau est crashé dans le décor
var isOnPlatform = function(vaisseau, plateformes){
  for(i of plateformes){
    if(mod((vaisseau.posX), cfgTerrain.width) >= i.index + 5 && mod((vaisseau.posX), cfgTerrain.width) <= i.index + 15) {
      //console.log('isOK')
      //i.isActive = false;
      return i;
    }
  }
  //console.log('isPasOK')
  return null;
}

var updateVaisseau = function(){
  if(keyEvent.gauche && !vaisseau.pose){
    vaisseau.angle -= Math.PI/60;
  }
  if(keyEvent.droite && !vaisseau.pose){
    vaisseau.angle += Math.PI/60;
  }
  vaisseau.acc = (keyEvent.haut) ? 0.0125 : 0;
  vaisseau.fuel -= 3 * vaisseau.acc;

  vaisseau.velX += vaisseau.acc * Math.sin(vaisseau.angle);
  vaisseau.velY += vaisseau.acc * Math.cos(vaisseau.angle) - gravite;
  vaisseau.posX += vaisseau.velX; 
  vaisseau.posY += vaisseau.velY;


  for(let x = -5; x < 5; x++){
    // Si contact avec le terrain
    if((vaisseau.posY - 5) <= terrain[mod(Math.floor(vaisseau.posX + x),cfgTerrain.width)] ){
      vaisseau.currentPlatform = isOnPlatform(vaisseau, plateformes);
      // Si le vaisseau va trop vite, est de travers ou n'est pas entièrement posé sur une plateforme
      if(vaisseau.velY < - vaisseau.vlimY || Math.abs(vaisseau.velX) > vaisseau.vlimX || vaisseau.currentPlatform == null){
          //console.log('crash');
          vaisseau.crash = true;
      }
      else if(!vaisseau.crash && !vaisseau.pose){
        //console.log('posé');
        vaisseau.pose = true;
        // Le vaisseau est replacé vers le haut et à la bonne altitude poour éviter des bugs de collision
        vaisseau.angle = 0;
        vaisseau.posY = terrain[mod(Math.floor(vaisseau.posX + x),cfgTerrain.width)] + 5
      }

      gravite = 0;
      vaisseau.acc = 0;
      vaisseau.velX = 0;
      vaisseau.velY = 0;
    }
    else{
      vaisseau.pose = false;
      gravite = 0.005;
    }
  }
};