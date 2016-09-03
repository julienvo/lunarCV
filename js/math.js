// Redéfinition du modulo pour avoir la bonne valeur pour les nombres négatifs
// => -1%1024 = 1023

var mod = function(nombre, modulo) {
        return ((nombre % modulo) + modulo) % modulo;
}