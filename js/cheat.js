var cheatCode = [38,38,40,40,37,39,37,39,66,65]; // haut, haut, bas, bas, gauche, droite, gauche, droite, b, a
var lastKeys = [0,0,0,0,0,0,0,0,0,0];

window.addEventListener('load', function(event){
  document.querySelector('#cheatButton').addEventListener('click', afficherIcones);
});

var afficherIcones = function(){
    document.querySelector('#cheatButton').style.display = 'none';
    // Affichage des liens de la navbar
    icones = document.querySelectorAll('nav a');
    [].forEach.call(icones, function(icone){
      icone.style.display = 'inline-block';
    });
};