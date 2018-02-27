var menuFoto = [];
var currentId = -1;
var onScreenId = 0;
var isOnScreen = false;

function alegeFile(){
  $("#photo").append(`<label class="custom-file-upload">
                      <input id="MyFile" type="file" onchange="puneFoto('MyFile')" accept=".png,.jpg,.jpeg"/>
                      <img src='icons/upload.png' width='50' height='50'/>
                      <br>Incarca
                      </label>`);
    addImageBox();
};

function puneFoto(id){

  isOnScreen = true;
  var width,height;
  var input = document.getElementById(id);
  var fReader = new FileReader();
  fReader.readAsDataURL(input.files[0]);
  $("#photo").empty();
  onScreenId = ++currentId;
  $("#photo").append(`<img class="${currentId}" />`);
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
      rotate:0,
      width:0,
      height:0,
      scale:100,
      grayscale:0,
      extension:'png'
    });
    drawFotoMenu();
  }
  $(`.${currentId}`)[0].onload = function(){
      menuFoto[onScreenId].width = this.naturalWidth;
      menuFoto[onScreenId].height = this.naturalHeight;
      let imageName = input.files[0].name.split(".");
      menuFoto[onScreenId].extension = imageName[imageName.length-1];
      resizePhoto(onScreenId);
  }
};

function resizePhoto(id){

  if(!isOnScreen)
    return;
  var maxWidth = parseInt($('#photo').css("width")) + 2*parseInt($('#photo').css("margin-left"));
  var maxHeight = parseInt($("#photo").css("height")) + 2*parseInt($("#photo").css("margin-top"));
  if(menuFoto[id].rotate == 90 || menuFoto[id].rotate == 270){
    let aux = maxWidth;
    maxWidth = maxHeight;
    maxHeight = aux;
  }
  var actualWidth = menuFoto[id].width;
  var actualHeight = menuFoto[id].height;
  var sol = 1;
  if(actualWidth <= maxWidth && actualHeight <= maxHeight){
    $("#photo").find("img").css("width",`${actualWidth*sol}`);
    $("#photo").find("img").css("height",`${actualHeight*sol}`);
    return;
  }
  var left=0,right=1;
  while(left <= right){
    let mid = (left + right)/2;
    if(actualWidth*mid <= maxWidth && actualHeight*mid <= maxHeight){
      sol = mid;
      left = mid + 0.01;
    }
    else {
      right = mid - 0.01;
    }
  }
  console.log(sol);
  $("#photo").find("img").css("width",`${actualWidth*sol}`);
  $("#photo").find("img").css("height",`${actualHeight*sol}`);
}

$(window).resize(() => {
  if(!isOnScreen)
    return;
  let id = $("#photo").find("img").attr("class").split(' ')[0];
  console.log(id);
  resizePhoto(id);
});

function addFotoMenu(image,id){

  $("#fotomenu").append(`<div class="fotoslide ${id}" onmouseover="addDeleteButton(${id})" onmouseleave="deleteDelButton(${id})" onclick="punePrincipala(${id})">
                         <img src="${image.src}" width="100" height="100"/>
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
  resizePhoto(onScreenId);
}

function addImageBox(){

  $("#fotomenu").append(`<div class="fotoslide">
  <label class="custom-file-upload">
                      <input id="Myfile" type="file" onchange="puneFoto('Myfile')" accept=".png,.jpg,.jpeg"/>
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
  elem.append(`<div class="delbutton" onclick="deleteFoto(${id})" width="15" height="15">
              <img src="icons/delete.ico" width="15" height="15"/>
              </div>`);
  var button = $(".delbutton");
  switch(menuFoto[id].rotate){
    case 0:
      button.css("transform","translate(85px,0px)");
      break;
    case 90:
      button.css("transform","rotate(-90deg)");
      break;
    case 180:
      button.css("transform","rotate(180deg) translate(0px,-82px)");
      break;
    case 270:
      button.css("transform","rotate(90deg) translate(82px,-82px)")
  }
};

function deleteDelButton(id){

  deleteButtonActive = false;
  $(".delbutton").remove();
};

function deleteFoto(id){

  deleteDelButton(id);
  delete menuFoto[id];
  let este = true;
  if(id == onScreenId){
    let gasit = false;
    for(var i in menuFoto)
      if(menuFoto[i]){
        gasit = true;
        onScreenId = i;
        break;
      }
    if(!gasit){
      $("#photo").empty();
      $("#photo").css("border-width","10px");
      $("#photo").css("width","300px");
      $("#photo").css("height","400px");
      alegeFile();
      este = false;
    }
  }
  drawFotoMenu();
  if(este)
    punePrincipala(onScreenId);

};

$(document).ready(alegeFile);

function rotireImagine(){

  if(!isOnScreen)
    return;
  menuFoto[onScreenId].rotate += 90;
  if(menuFoto[onScreenId].rotate > 270)
    menuFoto[onScreenId].rotate = 0;
  $(`.${onScreenId}`).css("transform",`rotate(${menuFoto[onScreenId].rotate}deg)`);
  resizePhoto(onScreenId);
};

var added = false;

function addSlider(id){
  if(added)
    return;
  added = true;
  let val;
  if(!isOnScreen)
    val = 100;
  else
    val = menuFoto[onScreenId][id];
  $(`#${id}`).append(`<input class="slider" type="range" min="1" max="200"/>`);
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
                                            contrast(${menuFoto[id].contrast}%)
                                            grayscale(${menuFoto[id].grayscale/2}%)`);
  $(`.${id}`).css("transform",`rotate(${menuFoto[id].rotate}deg)
                               scale(${menuFoto[id].scale/100})`);
};

function sliderAction(action){
  if(!isOnScreen)
    return;
  menuFoto[onScreenId][action] = $(`input[type="range"]`)[0].value;
  applyProp(onScreenId);
  resizePhoto(onScreenId);
};

function slideshow(){

  $("body").empty();
  $("body").append(`<div id="slideshow">
                    <div class="centered"><h1>Alegeti elementel ce vor fi in slideshow</h1></div>
                    <div id="imglist">

                    </div>
                    Introduceti numarul de secunde<input id="numberbox" type="number" value="1"/>
                    <button class="submitbtn" onclick="startSlideShow()">Start Slideshow</button>
                    <div>`);
  for(var i in menuFoto){
    if(!menuFoto[i])
      continue;
    $("#imglist").append(`<div class="element">
                            <div class="boximage">
                            <img src="${menuFoto[i].img.src}" class="img ${menuFoto[i].id}"/>
                            </div>
                            <input type="checkbox" id="c${menuFoto[i].id}"/>
                            </div>`);
    applyProp(menuFoto[i].id);
  }
};

var selectedImg = [];
var currentFoto = 1;

function startSlideShow(){
  let checkboxes = $(`input[type="checkbox"]`).toArray();
  let seconds = $('#numberbox')[0].value;
  console.log(seconds);
  for(var i in checkboxes){
    if(checkboxes[i].checked){
      selectedImg.push(checkboxes[i].id.slice(1,checkboxes[i].id.length));
    }
  }
  $("body").empty();
  $("body").append(`<div id="app"><div id="photo"></div></div>`);
  $("#photo").css("border-width","0px");
  $("#photo").css("width","0px");
  $("#photo").css("height","0px");
  if(selectedImg.length > 0){
    $("#photo").append(`<img class="${menuFoto[selectedImg[0]].id}" src="${menuFoto[selectedImg[0]].img.src}"/>`)
    resizePhoto(menuFoto[selectedImg[0]].id);
    applyProp(menuFoto[selectedImg[0]].id);
  }
  slide = setInterval(() => {puneFotoSlide();},seconds*1000);

};

function puneFotoSlide(){
  if(currentFoto >= selectedImg.length){
    clearInterval(slide);
    goToMainPage();
    return;
  }
  $("#photo").empty();
  $("#photo").append(`<img class="${menuFoto[selectedImg[currentFoto]].id}" src="${menuFoto[selectedImg[currentFoto]].img.src}"/>`);
  applyProp(menuFoto[selectedImg[currentFoto]].id);
  resizePhoto(menuFoto[selectedImg[currentFoto]].id);
  currentFoto ++;
}

function goToMainPage()
{

  $("body").empty();
  $("body").append(`<div id = "app">
			<div  id = "menu">
				<ul>
				<li>
					<button onclick="rotireImagine()" class = "btn">
						<img class = "img" src = "icons\\rotire.png" alt="rotire"/>
					</button>
			  </li>
				<li>
					<button class="btn" onmouseover="addSlider('contrast')" onmouseleave="removeSlider()" id="contrast">
						<img class = "img" src="icons\\contrast.png"/>
					</button>
				</li>
				<li>
					<button class="btn" onmouseover="addSlider('brightness')" onmouseleave="removeSlider()" id="brightness">
						<img class = "img" src="icons\\brightness.png"/>
					</button>
				</li>
				<li>
					<button class="btn" onmouseover="addSlider('invert')" onmouseleave="removeSlider()" id="invert">
						<img class = "img" src="icons\\invert.png"/>
					</button>
				</li>
				<li>
					<button class="btn" onmouseover="addSlider('grayscale')" onmouseleave="removeSlider()" id="grayscale">
						<img class = "img" src="icons\\gray-scale.png"/>
					</button>
				</li>
				<li>
					<button class="btn" onmouseover="addSlider('scale')" onmouseleave="removeSlider()" id="scale">
						<img class="img" src="icons\\scale.png"/>
					</button>
				</li>
				<li>
					<button class = "btn" onclick="slideshow()">
						<img class="img" src="icons\\slideshow.png"/>
					</button>
				</li>
				<li>
					<button class = "btn" onclick="drawCharts()">
						<img class="img" src="icons\\diagram.png"/>
					</button>
				</li>
				<li>
					<button class="btn" onclick="saveImage()">
						<img class="img" src="icons\\save.png"/>
					</button>
				</li>
			</ul>
			</div>
		<div id = "photo"></div>
		<div id="fotomenu">

			<ul id="imagelist">
			</ul>
		</div>
	</div>`);
  $("#photo").css("width","0px");
  $("#photo").css("height","0px");
  $("#photo").css("border-width","0px");
  punePrincipala(onScreenId);
  drawFotoMenu();
}

function createChart(data,color)
{

  let  count = [];
  for(let i = 0 ;i <= 255 ; ++i)
  count.push(i);
  var canvas = document.createElement("canvas");
  canvas.setAttribute("width",400);
  canvas.setAttribute("height",400);
  var ctx = canvas.getContext("2d");
  var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
      labels: count,
      datasets: [{
          label: '',
          data: data,
          backgroundColor:color,
          borderColor:'rgba(255,99,132,1)'
      }]
  },
  options: {
      responsive: true,
      maintainAspectRatio: false,
  }
  });
  return canvas;
}

function drawCharts(){

    if(!isOnScreen)
      return;
    var res = getRGBValues();
    let R = res[0];
    let G = res[1];
    let B = res[2];
    let canvas = [];
    canvas.push(createChart(R,'rgba(255,0,0,1)'));
    canvas.push(createChart(G,'rgba(0,255,0,1)'));
    canvas.push(createChart(B,'rgba(0,0,255,1)'));
    $("body").empty();
    $("body").append(`<div>
                      <img src="icons\\backbutton.png" onclick="goToMainPage()" width="50px" height="50px"/>
                      </div>`);
    $("body").append(`<div id="chart"></div>`);

    $("#chart").append(canvas[0]);
    $("#chart").append(canvas[1]);
    $("#chart").append(canvas[2]);
}

function getRGBValues(){

  let R = new Array(256).fill(0,0,255);
  let G = new Array(256).fill(0,0,255);
  let B = new Array(256).fill(0,0,255);
  let canvas = document.createElement("canvas");
  canvas.setAttribute("width",menuFoto[onScreenId].width);
  canvas.setAttribute("height",menuFoto[onScreenId].height);
  let ctx = canvas.getContext("2d");
  ctx.filter = `contrast(${menuFoto[onScreenId].contrast}%)
                brightness(${menuFoto[onScreenId].brightness}%)
                invert(${menuFoto[onScreenId].invert}%)
                grayscale(${menuFoto[onScreenId].grayscale/2}%)`;
  let img = $(`.${onScreenId}`)[0];
  ctx.drawImage(img,0,0);
  let canvasColor = ctx.getImageData(0,0,menuFoto[onScreenId].width,menuFoto[onScreenId].height).data;
  for(var i = 1 ; i <= canvasColor.length ; ++i){
    if(i % 4 == 1)
      R[canvasColor[i - 1]] ++;
    else if(i % 4 == 2)
      G[canvasColor[i - 1]] ++;
    else if(i % 4 == 3)
      B[canvasColor[i - 1]] ++;
  }
  return [R,G,B];
}

function puneImagine(image,canvas,ctx,degrees){

  if(degrees == 90 || degrees == 270) {
      canvas.width = image.height;
      canvas.height = image.width;
  } else {
      canvas.width = image.width;
      canvas.height = image.height;
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(degrees == 90 || degrees == 270) {
      ctx.translate(image.height/2,image.width/2);
  } else {
      ctx.translate(image.width/2,image.height/2);
 }
  ctx.rotate(degrees*Math.PI/180);
  ctx.filter = `contrast(${menuFoto[onScreenId].contrast}%)
                brightness(${menuFoto[onScreenId].brightness}%)
                invert(${menuFoto[onScreenId].invert}%)
                grayscale(${menuFoto[onScreenId].grayscale/2}%)`;
  ctx.drawImage(image,-image.width/2,-image.height/2);
};

function saveImage(){

  if(!isOnScreen)
    return;
  let img = document.createElement("img");
  img.setAttribute("src",menuFoto[onScreenId].img.src);
  let canvas = document.createElement("canvas");
  canvas.setAttribute("width",img.width);
  canvas.setAttribute("height",img.height);
  let ctx = canvas.getContext('2d');
  puneImagine(img,canvas,ctx,menuFoto[onScreenId].rotate);
  let gh = canvas.toDataURL(`image/${menuFoto[onScreenId].extension}`);
  let a  = document.createElement('a');
  a.href = gh;
  a.download = `image${onScreenId}.${menuFoto[onScreenId].extension}`;
  a.click();
};
