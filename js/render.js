var camera = {
  offsetX: 0,
  offsetY: 0,
  marginX: 150,
  marginY: 100,
  isZoomed: false,
  bottom: 0,
  facteurZoom: 1,
  init: function(x, y){ // Déplace la caméra de sorte que l'objet principal soit dans le coin en haut à gauche de l'écran
    this.offsetX = x - this.marginX;
    this.offsetY = y + this.marginY - canvas.height;
  },

  update: function(){
  //  if(vaisseau.posY < (terrain[mod(Math.floor(vaisseau.posX),cfgTerrain.width)] + 100) && !this.isZoomed){
  //    this.isZoomed = true;
  //    this.facteurZoom = 2;
  //    this.offsetX = vaisseau.posX - (vaisseau.posX - this.offsetX) / this.facteurZoom;
  //    this.offsetY = terrain[Math.floor(mod(vaisseau.posX,cfgTerrain.width))] * this.facteurZoom - 100;
  //    //this.offsetX = vaisseau.posX - canvas.width / 2;
  //    //this.offsetY = vaisseau.posY - canvas.height + this.marginY;
  //    console.log('Zoooom !!' + this.offsetX);
  //  }
  //  else if(vaisseau.posY > (terrain[mod(Math.floor(vaisseau.posX),cfgTerrain.width)] + 150) && this.isZoomed){
  //    this.isZoomed = false;
  //    this.offsetX = vaisseau.posX - (vaisseau.posX - this.offsetX) * this.facteurZoom;
  //    this.offsetY = vaisseau.posY - (vaisseau.posY - this.offsetY) * this.facteurZoom;
  //    this.facteurZoom = 1;
  //    console.log('apuZoom :(');
  //  }

    if((vaisseau.posX - this.offsetX > canvas.width - this.marginX && vaisseau.velX > 0) || (vaisseau.posX - this.offsetX  < this.marginX && vaisseau.velX < 0)){
      this.offsetX += vaisseau.velX;
    }

    //if(!this.isZoomed && !(vaisseau.posY < canvas.height - this.marginY)){
      //console.log('test');
      this.offsetY = vaisseau.posY - canvas.height + this.marginY;
    //}
    if(this.offsetY < this.bottom){
      console.log(this.bottom);
      this.offsetY = this.bottom;
    }
  //  else if((canvas.height - (vaisseau.posY - this.offsetY) < this.marginY && vaisseau.velY > 0) || (vaisseau.posY - this.offsetY) < this.marginY && vaisseau.velY < 0){
  //    this.offsetY += this.facteurZoom * vaisseau.velY;
  //  }
  //  if(this.offsetY < 0) {
  //    this.offsetY = 0;
  //  }
  }
};


var renderGame = function(canvas){
	let ctx = canvas.getContext("2d");
  
	ctx.save(); // pile -> coord défaut

  // Dessin du fond (et bientôt des étoiles)
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  // Dessin du vaisseau
	ctx.translate((vaisseau.posX - camera.offsetX) * camera.facteurZoom, canvas.height - (vaisseau.posY - camera.offsetY) * camera.facteurZoom);
	ctx.rotate(vaisseau.angle);
	ctx.fillStyle = '#fff';
  ctx.fillRect(-5 * camera.facteurZoom,-5 * camera.facteurZoom, 10* camera.facteurZoom, 10 * camera.facteurZoom);
  if(vaisseau.acc != 0){ // Dessin de l'échappement si on accélère
    ctx.fillStyle = '#aaa';
    ctx.fillRect(-5 * camera.facteurZoom,5 * camera.facteurZoom, 10 * camera.facteurZoom, 5 * camera.facteurZoom);
  }
	ctx.restore(); // coord défaut, pile vide

  // Dessin du terrain
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.moveTo(0, canvas.height - (terrain[mod(Math.floor(camera.offsetX), cfgTerrain.width)] - Math.floor(camera.offsetY)));
  ctx.beginPath();
  for(let i = 0; i < canvas.width / camera.facteurZoom; i++){
    if(terrain[i] != 0){
      ctx.lineTo(i*camera.facteurZoom, (canvas.height - (terrain[mod(i + Math.floor(camera.offsetX),cfgTerrain.width)]  - Math.floor(camera.offsetY)) * camera.facteurZoom));
    }
  }
  ctx.lineTo(canvas.width , canvas.height - terrain[canvas.width - 1]);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(0, terrain[0]);
  ctx.stroke();


  // Dessin de traits sous les plateformes pour les rendre plus visibles
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  for(let i = 0; i < plateformes.length; i++){
    // On grise les plateformes sur lesquelles on s'est déjà posé
    if(plateformes[i].isActive){
      ctx.strokeStyle = '#fff';
    }
    else {ctx.strokeStyle = '#888'}
    ctx.strokeRect(mod((plateformes[i].index + 2 - (vaisseau.posX - (vaisseau.posX - camera.offsetX) / camera.facteurZoom)), cfgTerrain.width), canvas.height - terrain[plateformes[i].index] + camera.offsetY + 1, 16 * camera.facteurZoom, camera.facteurZoom);
  }
};

var renderInfos = function(canvas){
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  ctx.fillText('Score : ', 50, 30);
  ctx.fillText('Time : ' + formatTime(timeElapsed), 50, 60);
  ctx.fillText('Fuel : ' + Math.round(vaisseau.fuel), 50, 90);
  ctx.fillText('Alt : ' + Math.floor(((vaisseau.posY - 5) - terrain[Math.floor(mod(vaisseau.posX,cfgTerrain.width))])/4), canvas.width - 250, 30);
  ctx.fillText("Horizontal speed : ", canvas.width - 250, 60);
  ctx.fillText("Vertical speed : ", canvas.width - 250, 90);

  if(Math.abs(vaisseau.velX) > vaisseau.vlimX){
    ctx.fillStyle = 'red';
  }
  ctx.fillText(Math.round(vaisseau.velX * 5), canvas.width - 115, 60);
  if(vaisseau.velY < - vaisseau.vlimY){
    ctx.fillStyle = 'red';
  }
  else{
    ctx.fillStyle = '#fff';
  }
  ctx.fillText(Math.round(vaisseau.velY * 5), canvas.width - 135, 90);
};