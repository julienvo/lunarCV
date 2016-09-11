// Définition de l'objet caméra
var camera = {
  offsetX: 0,
  offsetY: 0,
  marginX: 150,
  marginY: 100,
  isZoomed: false,
  bottom: 0,
  // Place l'objet caméra de façon à ce que l'objet principal soit
  // en haut à gauche de l'écran
  init: function(x, y){
    this.offsetX = x - this.marginX;
    this.offsetY = y + this.marginY - canvas.height;
  },

  update: function(){

    // L'objet caméra se déplace si le joueur s'approche des bords gauche et droite de l'écran
    if((vaisseau.posX - this.offsetX > canvas.width - this.marginX && vaisseau.velX > 0) || (vaisseau.posX - this.offsetX  < this.marginX && vaisseau.velX < 0)){
      this.offsetX += vaisseau.velX;
    }

    // L'objet caméra se positionne de façon à afficher le joueur à marginY pixels du haut de l'écran
    this.offsetY = vaisseau.posY - canvas.height + this.marginY;
    // Sauf si le joueur est trop près du bas du terrain, dans ce cas la caméra ne descend pas.
    if(this.offsetY < this.bottom){
      console.log(this.bottom);
      this.offsetY = this.bottom;
    }
  }
};


// Modifie la taille du canvas si l'utilisateur modifie la taille de la fenêtre
window.addEventListener('resize', function(){
  canvas.height = window.innerHeight - 238;
  infos.height = 82;
  infos.width = document.body.clientWidth;
  canvas.width = document.body.clientWidth;
  renderGame(canvas);
  renderInfos(infos);
}, false);


// Affiche le jeu
var renderGame = function(canvas){
  console.log('render');
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.save(); // pile -> coord défaut

  // Dessin du fond
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  // Dessin du vaisseau
  ctx.translate((vaisseau.posX - camera.offsetX), canvas.height - (vaisseau.posY - camera.offsetY));
  ctx.rotate(vaisseau.angle);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  //Corps
  //ctx.scale(4,4)
  ctx.beginPath();
  ctx.moveTo(2,-4);
  ctx.lineTo(4, -2);
  ctx.lineTo(4, 2);
  ctx.lineTo(2, 4);
  ctx.lineTo(-2, 4);
  ctx.lineTo(-4, 2);
  ctx.lineTo(-4, -2);
  ctx.lineTo(-2, -4);
  ctx.closePath();
  ctx.rect(-5,4,10,1);
  // Patte gauche
  ctx.moveTo(-2, 4);
  ctx.lineTo(-5, 8);
  //Pied gauche
  ctx.moveTo(-7, 8);
  ctx.lineTo(-3, 8);
  //Patte droite
  ctx.moveTo(2, 4);
  ctx.lineTo(5, 8);
  //Pied droit
  ctx.moveTo(7, 8);
  ctx.lineTo(3, 8);
  //Reacteur
  ctx.moveTo(-1, 4);
  ctx.lineTo(-2.5, 8);
  ctx.moveTo(1, 4);
  ctx.lineTo(2.5, 8);
  ctx.moveTo(2,7);
  ctx.lineTo(-2,7);
  //Flamme si le vaisseau accélère
  if(vaisseau.acc != 0){
    ctx.lineTo(0,16.5 + 3 * Math.random());
    ctx.closePath();
  }
  ctx.stroke();

  ctx.restore(); // coord défaut, pile vide



  // Dessin du ciel

  ctx.fillStyle = '#fff';
  for(var i in stars){
    if(stars[i].y > terrain[mod(Math.floor(stars[i].x + camera.offsetX),cfgTerrain.width)] - Math.floor(camera.offsetY)){
      ctx.fillRect(stars[i].x, canvas.height - stars[i].y, stars[i].size, stars[i].size);
    }
  }

  // Dessin du terrain
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.moveTo(0, canvas.height - (terrain[mod(Math.floor(camera.offsetX), cfgTerrain.width)] - Math.floor(camera.offsetY)));
  ctx.beginPath();
  for(var i = 0; i <= canvas.width; i++){
    ctx.lineTo(i, canvas.height - (terrain[mod(i + Math.floor(camera.offsetX),cfgTerrain.width)]  - Math.floor(camera.offsetY)));
  }
  ctx.stroke();


  // Dessin de traits sous les plateformes pour les rendre plus visibles
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  for(var i = 0; i < plateformes.length; i++){
    // On grise les plateformes sur lesquelles on s'est déjà posé
    if(!plateformes[i].isActive){
      ctx.strokeStyle = '#888';
    }
    else {ctx.strokeStyle = '#fff'}
    ctx.strokeRect(mod((plateformes[i].index + 2 - (vaisseau.posX - (vaisseau.posX - camera.offsetX))), cfgTerrain.width), canvas.height - terrain[plateformes[i].index] + camera.offsetY + 1, 26, 1);
  }
};

// Affiche les informations du jeu (multipliées de façon à avoir des valeurs lisibles)
var renderInfos = function(canvas){
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  ctx.fillText('Score : ' + score, 50, 26);
  ctx.fillText('Time : ' + formatTime(timeElapsed), 50, 52);
  ctx.fillText('Fuel : ' + Math.round(vaisseau.fuel), 50, 78);
  ctx.fillText('Alt : ' + Math.floor(((vaisseau.posY - 8) - terrain[Math.floor(mod(vaisseau.posX,cfgTerrain.width))])/4), canvas.width - 250, 26);
  ctx.fillText("Horizontal speed : ", canvas.width - 250, 52);
  ctx.fillText("Vertical speed : ", canvas.width - 250, 78);

  if(Math.abs(vaisseau.velX) > vaisseau.vlimX){
    ctx.fillStyle = 'red';
  }
  ctx.fillText(Math.round(vaisseau.velX * 5), canvas.width - 115, 52);
  if(vaisseau.velY < - vaisseau.vlimY){
    ctx.fillStyle = 'red';
  }
  else{
    ctx.fillStyle = '#fff';
  }
  ctx.fillText(Math.round(vaisseau.velY * 5), canvas.width - 135, 78);
};