var thrust = new Audio('audio/thrust.mp3');
thrust.volume = .3;
thrust.loop = true;

var boom = new Audio('audio/boom.mp3');
boom.volume = .4;

window.addEventListener('load',function(){
  document.querySelector('#soundButton').addEventListener('click', function(){
    if(thrust.muted){
      this.innerHTML = '<span class="icon-volume-up"></span>';
      boom.muted = false;
      thrust.muted = false;
    }
    else{
      this.innerHTML = '<span class="icon-volume-off"></span>';
      boom.muted = true;
      thrust.muted = true;
    }
  });

});