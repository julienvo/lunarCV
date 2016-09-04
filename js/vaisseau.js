var vaisseau = {
  posX: 100,
  posY: 800,
  angle: 0,
  velX: 0,
  velY: 0,
  acc: 0,
  crash: false,
  pose: false
};

var isOnPlatform = function(vaisseau, plateformes){
  for(i of plateformes){
    if(mod((vaisseau.posX), cfgTerrain.width) >= i + 5 && mod((vaisseau.posX), cfgTerrain.width) <= i + 15) {
      //console.log('isOK')
      return true;
    } 
  }
  //console.log('isPasOK')
  return false;
}

var updateVaisseau = function(){
  if(keyEvent.gauche){
    vaisseau.angle -= Math.PI/60;
  }
  if(keyEvent.droite){
    vaisseau.angle += Math.PI/60;
  }
  vaisseau.acc = (keyEvent.haut) ? 1 : 0;
  vaisseau.velX += vaisseau.acc/40 * Math.sin(vaisseau.angle);
  vaisseau.velY += vaisseau.acc/40 * Math.cos(vaisseau.angle) - gravite;
  vaisseau.posX += vaisseau.velX; 
  vaisseau.posY += vaisseau.velY;


  for(let x = -5; x < 5; x++){
    if((vaisseau.posY - 5) <= terrain[mod(Math.floor(vaisseau.posX + x),cfgTerrain.width)] ){
      if(vaisseau.velY > 1 || vaisseau.velX > 1 || !isOnPlatform(vaisseau, plateformes)){
          //console.log('crash');
          vaisseau.crash = true;
      }
      else if(!vaisseau.crash && !vaisseau.pose){
        //console.log('posé');
        vaisseau.pose = true;
        vaisseau.posY = terrain[mod(Math.floor(vaisseau.posX + x),cfgTerrain.width)] + 5
      }
          gravite = 0;
          vaisseau.acc = 0;
          vaisseau.velX = 0;
          vaisseau.velY = 0;

    }
    else{
      vaisseau.pose = false;
      gravite = 0.01;
    }
  }
};