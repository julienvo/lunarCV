var vaisseau = {
  posX: 100,
  posY: 100,
  angle: 0,
  velX: 0,
  velY: 0,
  acc: 0,
  crash: false,
  pose: false
};

var isOnPlatform = function(vaisseau, plateformes){
  for(i of plateformes){
    if(mod((vaisseau.posX + absX), cfg.width) >= i + 5 && mod((vaisseau.posX + absX), cfg.width) <= i + 15) {
      console.log('isOK')
      return true;
    } 
  }
  console.log('isPasOK')
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
  vaisseau.velY -= vaisseau.acc/40 * Math.cos(vaisseau.angle) - gravite;
  
  if((vaisseau.posX > canvas.width - 100 && vaisseau.velX > 0) || (vaisseau.posX < 100 && vaisseau.velX < 0)){
    absX += vaisseau.velX;
  }
  else{ vaisseau.posX += vaisseau.velX; }

  if((vaisseau.posY < 100 && absY <= 0)){
    absY += vaisseau.velY;
  }
  else{
    absY = 0;
    vaisseau.posY += vaisseau.velY;
  }


  for(let x = -5; x < 5; x++){
    if((canvas.height - vaisseau.posY - absY - 5) <= terrain[mod(Math.floor(vaisseau.posX + absX + x),cfg.width)] ){
      if(vaisseau.velY > 1 || vaisseau.velX > 1 || !isOnPlatform(vaisseau, plateformes)){
          console.log('crash');
          vaisseau.crash = true;
      }
      else if(!vaisseau.crash && !vaisseau.pose){
        console.log('posé');
        vaisseau.pose = true;
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