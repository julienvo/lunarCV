var competences = ['htmlcss', 'vanillajs', 'jquery', 'bootstrap', 'angular', 'mongo', 'nodejs', 'ajax', 'express', 'meteor'];

var cfgTerrain = {
  width: 3000, // De préférence supérieur à la taille du canvas :o
  nbPlateformes: competences.length, // De préférence inférieur à width / 100
  variance: 800,
  amorti: 1
}

var gravite = 0.005;
