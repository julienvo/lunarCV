var son = new Audio('audio/thrust.mp3');
son.volume = .3;
son.loop = true;

var boom = new Audio('audio/boom.mp3');
boom.volume = .4;

window.addEventListener('load',function(){
  document.querySelector('#soundButton').addEventListener('click', function(){
    if(son.muted){
      this.innerHTML = '<span class="icon-volume-up"></span>';
      boom.muted = false;
      son.muted = false;
    }
    else{
      this.innerHTML = '<span class="icon-volume-off"></span>';
      boom.muted = true;
      son.muted = true;
    }
  });

});