var camera = {
  offsetX: 0,
  offsetY: 0,
  marginX: 150,
  marginY: 100,
  isZoomed: false,
  facteurZoom: 1
}
var updateCamera = function(){
  if(vaisseau.posY < (terrain[mod(Math.floor(vaisseau.posX),cfgTerrain.width)] + 100) && !camera.isZoomed){
    camera.isZoomed = true;
    camera.facteurZoom = 2;
    camera.offsetX = vaisseau.posX - (vaisseau.posX - camera.offsetX) / camera.facteurZoom;
    camera.offsetY = terrain[Math.floor(mod(vaisseau.posX,cfgTerrain.width))] * camera.facteurZoom - 100;
    //camera.offsetX = vaisseau.posX - canvas.width / 2;
    //camera.offsetY = vaisseau.posY - canvas.height + camera.marginY;
    console.log('Zoooom !!' + camera.offsetX);
  }
  else if(vaisseau.posY > (terrain[mod(Math.floor(vaisseau.posX),cfgTerrain.width)] + 150) && camera.isZoomed){
    camera.isZoomed = false;
    camera.offsetX = vaisseau.posX - (vaisseau.posX - camera.offsetX) * camera.facteurZoom;
    camera.offsetY = vaisseau.posY - (vaisseau.posY - camera.offsetY) * camera.facteurZoom;
    camera.facteurZoom = 1;
    console.log('apuZoom :(');
  }



  if((vaisseau.posX - camera.offsetX > canvas.width - camera.marginX && vaisseau.velX > 0) || (vaisseau.posX - camera.offsetX  < camera.marginX && vaisseau.velX < 0)){
    camera.offsetX += vaisseau.velX;
  }

  if(!camera.isZoomed && !(vaisseau.posY < canvas.height - camera.marginY)){
    //camera.offsetY = vaisseau.posY - canvas.height + camera.marginY;
  }        
  else if((canvas.height - (vaisseau.posY - camera.offsetY) < camera.marginY && vaisseau.velY > 0) || (vaisseau.posY - camera.offsetY) < camera.marginY && vaisseau.velY < 0){
    camera.offsetY += camera.facteurZoom * vaisseau.velY;
  }
  if(camera.offsetY < 0) {
    camera.offsetY = 0;
  }
};


var render = function(canvas){
	var ctx = canvas.getContext("2d");
  
	ctx.save(); // pile -> coord défaut

  // Dessin du fond (et bientôt des étoiles)
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  // Dessin du vaisseau
	ctx.translate((vaisseau.posX - camera.offsetX) * camera.facteurZoom, canvas.height - (vaisseau.posY) * camera.facteurZoom);
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
  //ctx.strokeStyle = '#fff';
  //ctx.lineWidth = 4;
  //for(let i = 0; i < plateformes.length; i++){
  //  ctx.strokeRect(mod((plateformes[i] + 2 - (vaisseau.posX - (vaisseau.posX - camera.offsetX) / camera.facteurZoom)), cfgTerrain.width), canvas.height - terrain[plateformes[i]] + camera.offsetY + 2, 16 * camera.facteurZoom, camera.facteurZoom);
  //}
  //ctx.fillStyle = '#123456';
  //ctx.fill();
};