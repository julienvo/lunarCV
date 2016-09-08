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

    let max = terrain[0];
    let min = terrain[0];
    let indexMax = 0;
    let indexMin = 0;

    for (let i = 1; i < terrain.length; i++) {
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

var formatTime = function(time){
  if(isNaN(time)){
    return '0:00'
  }
  let secs = Math.floor(time / 1000);
  let mins = Math.floor(secs / 60);
  secs = secs % 60;
  if (secs < 10) secs = "0" + secs;
  return mins + ":" + secs;

};

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }
    return true;
}