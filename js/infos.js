var showMessage = function(message){
  document.querySelector('#message').innerHTML = message;
  document.querySelector("#messageContainer").style.display = 'block';
}

var hideMessage = function(){
  document.querySelector('#messageContainer').style.display = 'none';
}