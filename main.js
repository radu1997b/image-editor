var menuFoto = [];
var currentId = 0;
var onScreenId = 0;
var isOnScreen = false;

function alegeFile(){
  $("#photo").append("<input id=\"MyFile\" type=\"file\" onchange=\"puneFoto()\">");
};

function puneFoto(){

  isOnScreen = true;
  var input = document.getElementById("MyFile");
  var fReader = new FileReader();
  fReader.readAsDataURL(input.files[0]);
  $("#MyFile").remove();
  $(`${onScreenId}`).remove();
  onScreenId = ++currentId;
  $("#photo").append(`<img class="${currentId}" width="300" height=400 />`);
  fReader.onloadend = function(event){
    var img = document.getElementsByClassName(`${currentId}`)[0];
    img.src = event.target.result;
    addFotoMenu(img,onScreenId);
    menuFoto[onScreenId] = {
      img:img,
      id:currentId,
      contrast:100,
      brightness:100,
      invert:0,
      rotate:0
    };
  }
};

function addFotoMenu(image,id){

  $("#imagelist").append(`<li class="fotoslide ${id}">
  <img src="${image.src}" width="100" height="100"/>
  </li>`);
};

function addImageBox(){

}


$(document).ready(alegeFile);

var unghiRotire = 0;

function rotireImagine(){

  if(!isOnScreen)
    return;
  unghiRotire += 90;
  $(`.${onScreenId}`).css('transform',`rotate(${unghiRotire}deg)`);
  var width = $("#photo").css("width");
  $("#photo").css("width", $("#photo").css("height"));
  $("#photo").css("height",`${width}`);
};

var added = false;

function addSlider(id){

  if(added)
    return;
  added = true;
  var val;
  if(!isOnScreen)
    val = 50;
  else
    val = menuFoto[onScreenId][id];
  $(`#${id}`).append(`<input class="slider" type="range" min="1" max="100">`);
  $(`input[type="range"]`).attr("oninput",`sliderAction('${id}')`);
  $(`input[type="range"]`)[0].defaultValue = val;
};

function removeSlider(){

  added = false;
  $(`input[type="range"]`).remove();
};

function applyProp(){

  $(`.${onScreenId}`).css("-webkit-filter",`invert(${menuFoto[onScreenId].invert}%)
                                            brightness(${menuFoto[onScreenId].brightness}%)
                                            contrast(${menuFoto[onScreenId].contrast}%)`);
};

function sliderAction(action){
  if(!isOnScreen)
    return;
  menuFoto[onScreenId][action] = $(`input[type="range"]`)[0].value;
  applyProp();
};
