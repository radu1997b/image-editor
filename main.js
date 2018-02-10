var menuFoto = [];
var currentId = -1;
var onScreenId = 0;
var isOnScreen = false;

function alegeFile(){
  $("#photo").append(`<label class="custom-file-upload">
                      <input id="MyFile" type="file" onchange="puneFoto('MyFile')"/>
                      <img src='icons/upload.png' width='50' height='50'/>
                      <br>Incarca
                      </label>`);
    addImageBox();
};

function puneFoto(id){

  isOnScreen = true;
  var input = document.getElementById(id);
  var fReader = new FileReader();
  fReader.readAsDataURL(input.files[0]);
  $("#photo").empty();
  onScreenId = ++currentId;
  $("#photo").append(`<img class="${currentId}" width="300" height=400 />`);
  $("#photo").css("border-width","0px");
  fReader.onloadend = function(event){
    var img = document.getElementsByClassName(`${currentId}`)[0];
    $("#photo").css("height",img.height);
    $("#photo").css("width",img.width);
    img.src = event.target.result;
    menuFoto.push ({
      img:img,
      id:currentId,
      contrast:100,
      brightness:100,
      invert:0,
      rotate:0
    });
    drawFotoMenu();
  }
};

function addFotoMenu(image,id){

  $("#fotomenu").append(`<div class="fotoslide ${id}" onmouseover="addDeleteButton(${id})" onmouseleave="deleteDelButton(${id})" onclick="punePrincipala(${id})">
                         <img style="position:absolute;"src="${image.src}" width="100" height="100"/>
                         </div>`);
  applyProp(id);
};

function punePrincipala(id){

  if(!menuFoto[id])
    return;
  onScreenId = id;
  $("#photo").empty();
  $("#photo").append(`<img class="${id}" src="${menuFoto[id].img.src}" width="${menuFoto[id].img.width}" height="${menuFoto[id].img.height}"/>`);
  applyProp(onScreenId);
}

function addImageBox(){

  $("#fotomenu").append(`<div class="fotoslide">
  <label class="custom-file-upload">
                      <input id="Myfile" type="file" onchange="puneFoto('Myfile')"/>
                      <img src='icons/upload.png' width='50' height='50'/>
                      <br>Incarca
                      </label>
                      </div>`)
}

function drawFotoMenu(){

  $("#fotomenu").empty();
  for(var i in menuFoto){
    if(!menuFoto[i])
      continue;
    addFotoMenu(menuFoto[i].img,menuFoto[i].id);
  };
  addImageBox();
};

var deleteButtonActive = false;

function addDeleteButton(id){

  if(deleteButtonActive)
    return;
  deleteButtonActive = true;
  var elem = $(`.fotoslide.${id}`);
  elem.append(`<div class="delbutton" onclick="deleteFoto(${id})">
              <img src="icons/delete.ico" width="15" height="15"/>
              </div>`);
};

function deleteDelButton(id){

  deleteButtonActive = false;
  $(".delbutton").remove();
};

function deleteFoto(id){

  delete menuFoto[id];
  if(id == onScreenId){
    let gasit = false;
    for(var i in menuFoto)
      if(menuFoto[i]){
        gasit = true;
        onScreenId = i;
        break;
      }
    if(!gasit){
      $("#photo").css("border-width","10px");
      alegeFile();
    }
  }
  drawFotoMenu();
  punePrincipala(onScreenId);
};

$(document).ready(alegeFile);

function rotireImagine(){

  if(!isOnScreen)
    return;
  menuFoto[onScreenId].rotate += 90;
  $(`.${onScreenId}`).css("transform",`rotate(${menuFoto[onScreenId].rotate}deg)`);
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

function applyProp(id){

  $(`.${id}`).css("-webkit-filter",`invert(${menuFoto[id].invert}%)
                                            brightness(${menuFoto[id].brightness}%)
                                            contrast(${menuFoto[id].contrast}%)`);
  $(`.${id}`).css('transform',`rotate(${menuFoto[id].rotate}deg)`);
};

function sliderAction(action){
  if(!isOnScreen)
    return;
  menuFoto[onScreenId][action] = $(`input[type="range"]`)[0].value;
  applyProp(onScreenId);
};
