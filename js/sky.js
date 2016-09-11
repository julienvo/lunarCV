var stars = [];

// Génère nbStars avec une position aléatoire
var generateSky = function(width, height, nbStars){
  stars = [];
  for(var i =0; i<nbStars; i++){
    var x = Math.floor(Math.random() * width);
    var y = Math.floor(Math.random() * height);    
    var size = Math.random() * 2; 
    stars.push({x:x, y:y, size:size});
  }
}