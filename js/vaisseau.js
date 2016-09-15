var vaisseau = {
  maxFuel: 400,
  fuel: 0,
  posX: 0,
  posY: 0,
  angle: 0,
  velX: 0,
  velY: 0,
  acc: 0,
  crash: false,
  pose: false,
  currentPlatform: null,
  vlimX: 0.8,
  vlimY: 1,
  lastVelX: 0,
  lastVelY: 0,
  init: function(x, y, reset){
    if(reset) this.fuel = this.maxFuel;
    this.posX = x;
    this.posY = y;
    this.angle = 0;
    this.velX = 0;
    this.velY = 0;
    this.acc = 0;
    this.crash = false;
    this.pose = false;
    this.currentPlatform = null;
  }
}


// Retourne la plateforme sur laquelle le vaisseau est posé
// Retourne null si le vaisseau est crashé dans le décor
var isOnPlatform = function(vaisseau, plateformes){
  for(var i=0; i< plateformes.length; i++){
    if(mod((vaisseau.posX), cfgTerrain.width) >= plateformes[i].index + 7 && mod((vaisseau.posX), cfgTerrain.width) <= plateformes[i].index + 23) {
      return plateformes[i];
    }
  }
  return null;
};

// Mise à jour des données du vaisseau
var updateVaisseau = function(){
  vaisseau.fuel = Math.max(vaisseau.fuel - 3 * vaisseau.acc, 0);
  vaisseau.velX += vaisseau.acc * Math.sin(vaisseau.angle);
  vaisseau.velY += vaisseau.acc * Math.cos(vaisseau.angle) - gravite;
  vaisseau.posX += vaisseau.velX; 
  vaisseau.posY += vaisseau.velY;

  for(var x = -7; x < 7; x++){
    // Si contact avec le terrain
    if((vaisseau.posY - 9) <= terrain[mod(Math.floor(vaisseau.posX + x),cfgTerrain.width)] ){
      vaisseau.currentPlatform = isOnPlatform(vaisseau, plateformes);
      // Si le vaisseau va trop vite, est de travers ou n'est pas entièrement posé sur une plateforme
      if(vaisseau.velY < - vaisseau.vlimY || Math.abs(vaisseau.velX) > vaisseau.vlimX || vaisseau.currentPlatform == null || (mod(vaisseau.angle, 2*Math.PI) < 11 * Math.PI / 6 && mod(vaisseau.angle, 2* Math.PI) > Math.PI /6)){
          vaisseau.crash = true;
      }
      else if(!vaisseau.crash && !vaisseau.pose){ // Si on vient de se poser sur une plateforme
        vaisseau.pose = true;
        // Le vaisseau est replacé vers le haut et à la bonne altitude pour éviter des bugs de collision
        vaisseau.angle = 0;
        vaisseau.posY = terrain[mod(Math.floor(vaisseau.posX + x),cfgTerrain.width)] + 9
        
        // La vitesse du vaisseau juste avant qu'il ne touche la plateforme est stockée
        // pour pouvoir calculer le score à la prochaine frame
        vaisseau.lastVelX = vaisseau.velX;
        vaisseau.lastVelY = vaisseau.velY;
      }

      gravite = 0;
      vaisseau.acc = 0;
      vaisseau.velX = 0;
      vaisseau.velY = 0;
    }
    else{ // Si le vaisseau est en vol
      vaisseau.pose = false;
      gravite = 0.005;
    }
  }
};