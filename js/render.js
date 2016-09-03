var render = function(canvas){
	var ctx = canvas.getContext("2d");
  
	ctx.fillStyle = '#000';
	ctx.fillRect(0,0,canvas.width, canvas.height);
	ctx.save();
	ctx.translate(vaisseau.posX, vaisseau.posY);
	ctx.rotate(vaisseau.angle);
	ctx.fillStyle = '#fff';

  ctx.fillRect(-5,-5,10, 10);
  if(vaisseau.acc != 0){
    ctx.fillStyle = '#aaa';
    ctx.fillRect(-5,5,10, 5);
  }
	ctx.restore();

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  for(let i = 0; i < plateformes.length; i++){
    ctx.strokeRect(mod((plateformes[i] + 2 - absX), cfg.width), canvas.height - terrain[plateformes[i]] - absY + 2, 16, 1);
  } 

  ctx.lineWidth = 1;
  ctx.moveTo(0, canvas.height - terrain[mod(Math.floor(absX), cfg.width)] - Math.floor(absY));
  ctx.beginPath();
  for(let i = 0; i < canvas.width; i++){
    if(terrain[i] != 0){
      ctx.lineTo(i, canvas.height - terrain[mod((i + Math.floor(absX)),cfg.width)] - Math.floor(absY));
    }
  }
  ctx.lineTo(canvas.width , canvas.height - terrain[canvas.width - 1]);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(0, terrain[0]);
  ctx.stroke();

  //ctx.fillStyle = '#123456';
  //ctx.fill();
};