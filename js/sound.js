var son = new Audio('audio/thrust.mp3');
son.volume = .3;
son.loop = true;

window.addEventListener('load',function(){
  document.querySelector('#soundButton').addEventListener('click', function(){
    console.log(son.muted)
    if(son.muted){
      this.innerHTML = '<span class="icon-volume-up"></span>';
      son.muted = false;
    }
    else{
      this.innerHTML = '<span class="icon-volume-off"></span>';
      son.muted = true;
    }
  });

});