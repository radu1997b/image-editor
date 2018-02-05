function alegeFile(){
  $("#photo").append("<input id=\"MyFile\" type=\"file\" onchange=\"puneFoto()\">");
};

function puneFoto(){

  var input = document.getElementById("MyFile");
  var fReader = new FileReader();
  fReader.readAsDataURL(input.files[0]);
  $("#MyFile").remove();
  $("#photo").append(`<img id="imagine" width="300" height=400 />`);
  fReader.onloadend = function(event){
  var img = document.getElementById("imagine");
  img.src = event.target.result;
}
};

$(document).ready(alegeFile);

var unghiRotire = 0;

function rotireImagine(){

  unghiRotire += 90;
  $("#imagine").css("transform",`rotate(${unghiRotire}deg)`);
  var width = $("#photo").css("width");
  $("#photo").css("width",$("#photo").css("height"));
  $("#photo").css("height",width);

};
