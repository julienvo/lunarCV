var terrain = [];
var plateformes = [];

var initializeTerrain = function(){
  for(var i = 0; i < cfgTerrain.width; i++){
    terrain[i] = 0;
  }
  terrain[0] = terrain[cfgTerrain.width - 1] = 200;
}

// Génère le terrain :
// Prend les 2 points extrêmes du terrain, on calcule l'abscisse du point du milieu
// puis déplace verticalment et aléatoirement ce point.
// Applique récursivement la fonction sur les 2 segments obtenus jusqu'à ce que tous les points du terrain
// aient été traités, en diminuant à chaque récursion la valeur maximale du déplacement.

var generateTerrain = function(indexDepart, indexArrivee, variance, amorti){
  if(indexDepart + 1 == indexArrivee) { return;}
  var indexMilieu = Math.floor((indexDepart + indexArrivee ) / 2);
  terrain[indexMilieu] = (terrain[indexDepart] + terrain[indexArrivee]) / 2 + (Math.random() - 0.3) * variance;
  generateTerrain(indexDepart, indexMilieu, variance * amorti, amorti * 0.75);
  generateTerrain(indexMilieu, indexArrivee, variance * amorti, amorti * 0.75);
};

// Génère nbPlateformes placées de façon aléatoire sur le terrain
var generatePlateformes = function(nbPlateformes){
  var plateformes = [];
  for(var plateforme = 0; plateforme< nbPlateformes; plateforme++){
    var indexPlateforme;
    // Tant que la nouvelle plateforme est trop proche d'une plateforme déjà existante, on change sa position
    var isValid = false;
    while(!isValid){
      indexPlateforme = Math.floor(Math.random() * (cfgTerrain.width - 30));
      isValid = true;
      for(var i=0; i< plateformes.length; i++){
        if(indexPlateforme >= plateformes[i].index-100 && indexPlateforme <= plateformes[i].index+100){
          isValid = false;
        }
      }
    }
    // Ajout de la plateforme à la liste des plateformes
    plateformes.push({index: indexPlateforme, isActive: true});
    // Aplanissement du terrain correspondant à la plateforme
    for(var pixel = 0; pixel < 30; pixel++){
      if(pixel + indexPlateforme < cfgTerrain.width){
        terrain[indexPlateforme + pixel] = terrain[indexPlateforme];
      }
    }
  }
  return plateformes;

  return plateformes;
};