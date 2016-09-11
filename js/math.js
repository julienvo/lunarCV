// Redéfinition du modulo pour avoir la bonne valeur pour les nombres négatifs
// => -1%1024 = 1023

var mod = function(nombre, modulo) {
        return ((nombre % modulo) + modulo) % modulo;
}

// Retourne les coordonnées des points le plus haut et le plus bas du terrain
var extremePoints = function(terrain) {
    if (terrain.length === 0) {
        return -1;
    }

    var max = terrain[0];
    var min = terrain[0];
    var indexMax = 0;
    var indexMin = 0;

    for (var i = 1; i < terrain.length; i++) {
        if (terrain[i] > max) {
          indexMax = i;
          max = terrain[i];
        }
        else if(terrain[i] < min){
          indexMin = i;
          min = terrain[i];  
        }
    }

    return {highest: {x: indexMax, y: max}, lowest: {x: indexMin, y: min}};
}

// Formate le temps écoulé au format m:ss
var formatTime = function(time){
  if(isNaN(time)){
    return '0:00'
  }
  var secs = Math.floor(time / 1000);
  var mins = Math.floor(secs / 60);
  secs = secs % 60;
  if (secs < 10) secs = "0" + secs;
  return mins + ":" + secs;

};

// Retourne true si les contenus des 2 tableaux passés en arguments sont identiques
function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }
    return true;
};