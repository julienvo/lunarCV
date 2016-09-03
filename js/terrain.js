var terrain = [];
var plateformes = [];
var variance = 500;
var amorti = 0.95;

var initializeTerrain = function(){
  for(i = 0; i < cfg.width; i++){
    terrain[i] = 0;
  }
  terrain[0] = terrain[cfg.width - 1] = 200;
}

var generateTerrain = function(indexDepart, indexArrivee, variance, amorti, level){
  if(indexDepart + 1 == indexArrivee || level == 0) { return;}
  let indexMilieu = Math.floor((indexDepart + indexArrivee ) / 2);
  terrain[indexMilieu] = (terrain[indexDepart] + terrain[indexArrivee]) / 2 + (Math.random() - 0.3) * variance;
  //console.log(terrain[indexDepart], terrain[indexMilieu], terrain[indexArrivee]);
  generateTerrain(indexDepart, indexMilieu, variance * amorti, amorti * 0.75, level - 1);
  generateTerrain(indexMilieu, indexArrivee, variance * amorti, amorti * 0.75, level - 1);
};

var generatePlateformes = function(nbPlateformes){
  for(let plateforme = 0; plateforme< nbPlateformes; plateforme++){
    let indexPlateforme;
    let isValid = false;
    // Tant que la nouvelle plateforme est trop proche d'une plateforme déjà existante, on change sa position
    while(!isValid){
      indexPlateforme = Math.floor(Math.random() * (cfg.width - 30));
      isValid = true;
      for(let i of plateformes){
        if(indexPlateforme >= i-100 && indexPlateforme <= i+100){
          isValid = false;
        }
      }
    }
    console.log(indexPlateforme);
    plateformes.push(indexPlateforme);
    for(let pixel = 0; pixel < 20; pixel++){
      if(pixel + indexPlateforme < cfg.width){
        terrain[indexPlateforme + pixel] = terrain[indexPlateforme];
      }
    }
  }

};