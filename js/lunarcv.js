(function(){

  /////////////////////////////
  //
  // config.js
  //
  /////////////////////////////

  var competences = ['htmlcss', 'vanillajs', 'jquery', 'bootstrap', 'angular', 'mongo', 'nodejs', 'ajax', 'express', 'meteor'];
  var compteurCompetences;
  var cfgTerrain = {
    width: 3000, // De préférence supérieur à la taille du canvas :o
    nbPlateformes: competences.length, // De préférence inférieur à width / 100
    variance: 800,
    amorti: 1
  };
  
  var gravite = 0.005;

  /////////////////////////////
  //
  // Cheat.js
  //
  /////////////////////////////
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

  /////////////////////////////
  //
  // infos.js
  //
  /////////////////////////////

  var showMessage = function(message){
    document.querySelector('#message').innerHTML = message;
    document.querySelector("#messageContainer").style.display = 'block';
  };

  /////////////////////////////
  //
  // main.js
  //
  /////////////////////////////

  var debug = false;
  
  var keyEvent = {
    gauche: false,
    droite: false,
    haut: false,
    bas: false,
    entree: false
  };
  
  var timeStart, timeElapsed, compteur, compteurFrames;
  var state = 'start';
  var score = 8000;
  
  window.addEventListener('load', function(event){
    var message = document.getElementById('message');
    var canvas = document.getElementById('canvas');
    var infos = document.getElementById('infos');
  
    window.onkeydown = function(event){
      // Stocke les 8 dernières touches entrées pour le cheat code :o
      var code = event.keyCode;
      lastKeys.shift();
      lastKeys.push(code);
      if(arraysEqual(lastKeys,cheatCode)){
        afficherIcones();
      }
  
      switch(code){
        case 13:
        event.preventDefault();
        keyEvent.entree = true;
        break;
  
        case 32:
        event.preventDefault();
        if(state == 'gameOver'){
          initGame();
        }
        startGame();
        break;
  
        case 37:
        event.preventDefault();
        keyEvent.gauche = true;
        break;
  
        case 38:
        event.preventDefault();
        keyEvent.haut = true;
        break;
  
        case 39:
        event.preventDefault();
        keyEvent.droite = true;
        break;
  
        case 40:
        event.preventDefault();
        keyEvent.bas = true;
        break;
      };
    };
  
    window.onkeyup = function(event){
      event.preventDefault();
      var code = event.keyCode;
      switch(code){            
        case 13:
        keyEvent.entree = false;
        break;
        case 37:
        keyEvent.gauche = false;
        break;
        case 38:
        keyEvent.haut = false;
        break;
        case 39:
        keyEvent.droite = false;
        break;
        case 40:
        keyEvent.bas = false;
        break;
      };
    };
  
  var updateGame = function(){
    compteurFrames++;
    if(compteurFrames % 50 == 0){
      score -= 50;
    }
  
    // Message de victoire
    if(compteurCompetences == 10){
      showMessage('Vous avez gagné !!! <br /><br /> Vous pouvez désormais accéder à la version pdf de mon CV en cliquant sur le lien dans la navbar.');
      afficherIcones();
    }
  
    else if(!vaisseau.crash && state == 'playing'){
      updateVaisseau();
  
      // Si le vaisseau est sur une plateforme
      if(vaisseau.pose){
        // Si le vaisseau ne s'est pas encore posé sur la plateforme
        // on affiche la compétence correspondante sous le canvas
        if(vaisseau.currentPlatform.isActive){
          score += Math.max(Math.round(2000 * (1-(vaisseau.lastVelX - vaisseau.lastVelY))), 0);
          vaisseau.currentPlatform.isActive = false;
          var competence = document.querySelector('#'+competences[compteurCompetences]);
          competence.className = '';
          setTimeout(function(){competence.style.opacity = 1;}, 100);
          compteurCompetences++;
        }
      }
      else{ // Le vaisseau ne peut pas tourner si il est posé sur une plateforme
        if(keyEvent.gauche){
          vaisseau.angle -= Math.PI/60;
        }
        if(keyEvent.droite){
          vaisseau.angle += Math.PI/60;
        }
      }
  
      vaisseau.acc = (keyEvent.haut && (vaisseau.fuel > 0 )) ? 0.0125 : 0;
  
      timeElapsed = (Date.now() - timeStart);
      camera.update();
      renderGame(canvas);
      renderInfos(infos);
      requestAnimationFrame(updateGame);
    }
    else{ // Game over :(
      state = 'gameOver';
      showMessage('You died.<br/><br/>(noob.) <br/><br/>Press Space to restart');
    }
  };
  
  var initGame = function(){  
  
    // Génération du terrain
    initializeTerrain();
    generateTerrain(0, cfgTerrain.width -1, cfgTerrain.variance, cfgTerrain.amorti);
    plateformes = generatePlateformes(cfgTerrain.nbPlateformes);
   
    // Génération du ciel
    generateSky(canvas.width, canvas.height, 1800);
  
    // Positionnement du vaisseau en haut et à gauche du point le plus haut
    // Et configuration de la limite basse de la caméra
    var extremites = extremePoints(terrain);
    vaisseau.init(extremites.highest.x - 300, extremites.highest.y + 200);
    camera.bottom = extremites.lowest.y - 50;
    camera.init(vaisseau.posX, vaisseau.posY);
    renderGame(canvas);
    renderInfos(infos);
  
    // Masquage des logos des compétences
    var divs = document.querySelectorAll('#barreCompetences div');
    [].forEach.call(divs, function(div) {
      div.className += " hidden";
      div.style.opacity = 0;
    });
  
    // Affichage du message d'accueil
    showMessage('Appuyez sur espace pour jouer. <br/><br/>Pour accéder directement à mon CV, il suffit d\'entrer le code mystère. (Ou vous pouvez aussi appuyer sur le bouton à côté de mon nom.)');
  }
  
  var startGame = function(){
    if(!(state == 'playing')){
      state = 'playing';
      compteurCompetences = 0;
      compteurFrames = 0;
      scoreTemps = 0;
      timeStart = Date.now();
      updateGame();
      messageContainer.style.display = 'none';
    }
  };
  
  // Initialise les taille des canvas et initialise le jeu
  canvas.height = window.innerHeight - 238;
  infos.height = 82;
  infos.width = document.body.clientWidth;
  canvas.width = document.body.clientWidth;
  initGame();

  });

  /////////////////////////////
  //
  // math.js
  //
  /////////////////////////////

  // Redéfinition du modulo pour avoir la bonne valeur pour les nombres négatifs
  // => -1%1024 = 1023

  var mod = function(nombre, modulo) {
          return ((nombre % modulo) + modulo) % modulo;
  };

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

  /////////////////////////////
  //
  // terrain.js
  //
  /////////////////////////////

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
    if(debug){
      console.log(terrain[indexDepart], terrain[indexMilieu], terrain[indexArrivee]);
    }
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
      if(debug){
        console.log(indexPlateforme);
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

  };

  /////////////////////////////
  //
  // render.js
  //
  /////////////////////////////

  // Définition de l'objet caméra
  var camera = {
    offsetX: 0,
    offsetY: 0,
    marginX: 150,
    marginY: 100,
    isZoomed: false,
    bottom: 0,
    // Place l'objet caméra de façon à ce que l'objet principal soit
    // en haut à gauche de l'écran
    init: function(x, y){
      this.offsetX = x - this.marginX;
      this.offsetY = y + this.marginY - canvas.height;
    },

    update: function(){

      // L'objet caméra se déplace si le joueur s'approche des bords gauche et droite de l'écran
      if((vaisseau.posX - this.offsetX > canvas.width - this.marginX && vaisseau.velX > 0) || (vaisseau.posX - this.offsetX  < this.marginX && vaisseau.velX < 0)){
        this.offsetX += vaisseau.velX;
      }

      // L'objet caméra se positionne de façon à afficher le joueur à marginY pixels du haut de l'écran
      this.offsetY = vaisseau.posY - canvas.height + this.marginY;
      // Sauf si le joueur est trop près du bas du terrain, dans ce cas la caméra ne descend pas.
      if(this.offsetY < this.bottom){
        console.log(this.bottom);
        this.offsetY = this.bottom;
      }
    }
  };

  // Affiche le jeu
  var renderGame = function(canvas){
    var ctx = canvas.getContext("2d");
    
    ctx.save(); // pile -> coord défaut

    // Dessin du fond
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    // Dessin du vaisseau
    ctx.translate((vaisseau.posX - camera.offsetX), canvas.height - (vaisseau.posY - camera.offsetY));
    ctx.rotate(vaisseau.angle);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    //Corps
    //ctx.scale(4,4)
    ctx.moveTo(2,-4);
    ctx.lineTo(4, -2);
    ctx.lineTo(4, 2);
    ctx.lineTo(2, 4);
    ctx.lineTo(-2, 4);
    ctx.lineTo(-4, 2);
    ctx.lineTo(-4, -2);
    ctx.lineTo(-2, -4);
    ctx.closePath();
    ctx.rect(-5,4,10,1);
    // Patte gauche
    ctx.moveTo(-2, 4);
    ctx.lineTo(-5, 8);
    //Pied gauche
    ctx.moveTo(-7, 8);
    ctx.lineTo(-3, 8);
    //Patte droite
    ctx.moveTo(2, 4);
    ctx.lineTo(5, 8);
    //Pied droit
    ctx.moveTo(7, 8);
    ctx.lineTo(3, 8);
    //Reacteur
    ctx.moveTo(-1, 4);
    ctx.lineTo(-2.5, 8);
    ctx.moveTo(1, 4);
    ctx.lineTo(2.5, 8);
    ctx.moveTo(2,7);
    ctx.lineTo(-2,7);
    //Flamme si le vaisseau accélère
    if(vaisseau.acc != 0){
      ctx.lineTo(0,16.5 + 3 * Math.random());
      ctx.closePath();
    }
    ctx.stroke();

    ctx.restore(); // coord défaut, pile vide



    // Dessin du ciel

    ctx.fillStyle = '#fff';
    for(var i in stars){
      if(stars[i].y > terrain[mod(Math.floor(stars[i].x + camera.offsetX),cfgTerrain.width)] - Math.floor(camera.offsetY)){
        ctx.fillRect(stars[i].x, canvas.height - stars[i].y, stars[i].size, stars[i].size);
      }
    }

    // Dessin du terrain
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.moveTo(0, canvas.height - (terrain[mod(Math.floor(camera.offsetX), cfgTerrain.width)] - Math.floor(camera.offsetY)));
    ctx.beginPath();
    for(var i = 0; i <= canvas.width; i++){
      ctx.lineTo(i, canvas.height - (terrain[mod(i + Math.floor(camera.offsetX),cfgTerrain.width)]  - Math.floor(camera.offsetY)));
    }
    ctx.stroke();


    // Dessin de traits sous les plateformes pour les rendre plus visibles
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    for(var i = 0; i < plateformes.length; i++){
      // On grise les plateformes sur lesquelles on s'est déjà posé
      if(!plateformes[i].isActive){
        ctx.strokeStyle = '#888';
      }
      else {ctx.strokeStyle = '#fff'}
      ctx.strokeRect(mod((plateformes[i].index + 2 - (vaisseau.posX - (vaisseau.posX - camera.offsetX))), cfgTerrain.width), canvas.height - terrain[plateformes[i].index] + camera.offsetY + 1, 26, 1);
    }
  };

  // Affiche les informations du jeu (multipliées de façon à avoir des valeurs lisibles)
  var renderInfos = function(canvas){
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Score : ' + score, 50, 26);
    ctx.fillText('Time : ' + formatTime(timeElapsed), 50, 52);
    ctx.fillText('Fuel : ' + Math.round(vaisseau.fuel), 50, 78);
    ctx.fillText('Alt : ' + Math.floor(((vaisseau.posY - 8) - terrain[Math.floor(mod(vaisseau.posX,cfgTerrain.width))])/4), canvas.width - 250, 26);
    ctx.fillText("Horizontal speed : ", canvas.width - 250, 52);
    ctx.fillText("Vertical speed : ", canvas.width - 250, 78);

    if(Math.abs(vaisseau.velX) > vaisseau.vlimX){
      ctx.fillStyle = 'red';
    }
    ctx.fillText(Math.round(vaisseau.velX * 5), canvas.width - 115, 52);
    if(vaisseau.velY < - vaisseau.vlimY){
      ctx.fillStyle = 'red';
    }
    else{
      ctx.fillStyle = '#fff';
    }
    ctx.fillText(Math.round(vaisseau.velY * 5), canvas.width - 135, 78);
  };

  /////////////////////////////
  //
  // vaisseau.js
  //
  /////////////////////////////

  var vaisseau = {
    maxFuel: 400,
    fuel: 0,
    posX: 0,
    posY: 0,
    angle: 0,
    velX: 0,
    velY: 0,
    acc: 0,
    crash: false,
    pose: false,
    currentPlatform: null,
    vlimX: 0.8,
    vlimY: 1,
    lastVelX: 0,
    lastVelY: 0,
    init: function(x, y){
      this.fuel = this.maxFuel;
      this.posX = x;
      this.posY = y;
      this.angle = 0;
      this.velX = 0;
      this.velY = 0;
      this.acc = 0;
      this.crash = false;
      this.pose = false;
      this.currentPlatform = null;
    }
  };


  // Retourne la plateforme sur laquelle le vaisseau est posé
  // Retourne null si le vaisseau est crashé dans le décor
  var isOnPlatform = function(vaisseau, plateformes){
    for(var i=0; i< plateformes.length; i++){
      if(mod((vaisseau.posX), cfgTerrain.width) >= plateformes[i].index + 7 && mod((vaisseau.posX), cfgTerrain.width) <= plateformes[i].index + 23) {
        //console.log('isOK')
        //i.isActive = false;
        return plateformes[i];
      }
    }
    //console.log('isPasOK')
    return null;
  }

  var updateVaisseau = function(){
    vaisseau.fuel = Math.max(vaisseau.fuel - 3 * vaisseau.acc, 0);
    vaisseau.velX += vaisseau.acc * Math.sin(vaisseau.angle);
    vaisseau.velY += vaisseau.acc * Math.cos(vaisseau.angle) - gravite;
    vaisseau.posX += vaisseau.velX; 
    vaisseau.posY += vaisseau.velY;

    for(var x = -7; x < 7; x++){
      // Si contact avec le terrain
      if((vaisseau.posY - 9) <= terrain[mod(Math.floor(vaisseau.posX + x),cfgTerrain.width)] ){
        vaisseau.currentPlatform = isOnPlatform(vaisseau, plateformes);
        // Si le vaisseau va trop vite, est de travers ou n'est pas entièrement posé sur une plateforme
        if(vaisseau.velY < - vaisseau.vlimY || Math.abs(vaisseau.velX) > vaisseau.vlimX || vaisseau.currentPlatform == null || (mod(vaisseau.angle, 2*Math.PI) < 11 * Math.PI / 6 && mod(vaisseau.angle, 2* Math.PI) > Math.PI /6)){
            if(debug){
              console.log('crash');
            }
            vaisseau.crash = true;
        }
        else if(!vaisseau.crash && !vaisseau.pose){
          if(debug){
            console.log('posé');
          }
          vaisseau.pose = true;
          // Le vaisseau est replacé vers le haut et à la bonne altitude pour éviter des bugs de collision
          vaisseau.angle = 0;
          vaisseau.posY = terrain[mod(Math.floor(vaisseau.posX + x),cfgTerrain.width)] + 9
          
          // La vitesse du vaisseau juste avant qu'il ne touche la plateforme est stockée
          // pour pouvoir calculer le score à la prochaine frame
          vaisseau.lastVelX = vaisseau.velX;
          vaisseau.lastVelY = vaisseau.velY;
        }

        gravite = 0;
        vaisseau.acc = 0;
        vaisseau.velX = 0;
        vaisseau.velY = 0;
      }
      else{
        vaisseau.pose = false;
        gravite = 0.005;
      }
    }
  };

  /////////////////////////////
  //
  // sky.js
  //
  /////////////////////////////

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


})();