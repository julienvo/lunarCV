// Objet servant à afficher le score lorsque le vaisseau se pose sur une plateforme
var scoreObj = {
  taille: 12,
  opacite:1,
  valeur: 0,
  isActive: 0,
  posX: 0,
  posY: 0,
  init: function(x,y,score){
    this.posX = x;
    this.posY = y;
    this.taille = 12;
    this.valeur = score;
    this.isActive = true;
    this.opacite = 1;
  },
  update: function() {
    this.taille += 1/3;
    this.opacite -= 1 / 60;
    if (this.taille >= 42) {
      this.isActive = false;
    }
  },
  render: function() {
    ctx = canvas.getContext('2d');
    ctx.save();
    ctx.font = this.taille + "px jurabook";
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, ' + this.opacite + ')';
    ctx.fillText('+' + this.valeur, mod((this.posX - camera.offsetX), cfgTerrain.width) * camera.facteurZoom, canvas.height - (this.posY - camera.offsetY) * camera.facteurZoom);
    ctx.restore();
  }
};