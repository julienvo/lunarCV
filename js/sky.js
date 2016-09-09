var stars = [];

var generateSky = function(width, height, nbStars){
  stars = [];
  for(let i =0; i<nbStars; i++){
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);    
    let size = Math.random() * 2; 
    stars.push({x:x, y:y, size:size});
  }
}