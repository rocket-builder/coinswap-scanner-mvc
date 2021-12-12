//const api_url = "http://127.0.0.1:8081/";
const api_url = "/";

const loaderSmall = '<div class="ui active inverted dimmer" id="loader"><div class="ui loader small"></div></div>';
const loader = '<div class="ui active inverted dimmer" id="loader"><div class="ui loader"></div></div>';
const user = getSessionUser();
const currentUser = getCurrentUser();

Array.prototype.pushArray = function(arr) {
  this.push.apply(this, arr);
};

function getSessionUser(){
  let usr = null;
  $.ajax({
    type: 'GET',
    url: api_url + "session/user",
    dataType: "json",
    success: function(data) {
      usr = data;
    },
    async: false
  });

  console.log(usr);
  return usr;
}
function getCurrentUser(){
  let usr = null;
  $.ajax({
    type: 'GET',
    url: api_url + "user/current",
    dataType: "json",
    success: function(data) {
      usr = data;
    },
    async: false
  });

  console.log(usr);
  return usr;
}
String.prototype.isEmpty = function () {
  return (!this || /^\s*$/.test(this));
}

$('.ui.dropdown').dropdown();

$('.ui.checkbox').checkbox();

$('.btn-copy-code').click(function() {

  let code = $(this).prev().prev().val();
  console.log(code);

  $(this).prev().prev().select();

  document.execCommand("copy");
  $(this).transition('jiggle');
});

function hideLoader(){
  $('#loader').transition({
    animation  : 'fade out',
    onComplete : function() {
      $('#loader').remove();
    }
  });
}

function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if(d > 0){//Use timestamp until depleted
      r = (d + r)%16 | 0;
      d = Math.floor(d/16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r)%16 | 0;
      d2 = Math.floor(d2/16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

String.prototype.isBlank = function(){
  return (!this || /^\s*$/.test(this));
}
String.prototype.fromCsv = function() {
  return this.split(';');
}
Array.prototype.toCsv = function () {
  return this.join(";");
}

let numberOfPinnedPosts = 0;
function pinFork()  {

}

$( document ).ready(function() {

  let numberOfPinnedPosts = 0;

  console.log($('.thumbtack-icon'));
  console.log('Количество незакрепленных иконок после загрузки: ' + $('.thumbtack-icon').length);
  console.log('Количество закрепленных постов после загрузки: ' + $('.thumbtack-icon-active').length);
  console.log('Переменная закрепленных постов после загрузки: ' + numberOfPinnedPosts);
  console.log($('.thumbtack-icon.active'));

  function pinFork()  {

    let fork = $(this).closest('.fork').clone();
    $(this).closest('.fork').remove();
    console.log(fork);
    $(fork).find('.thumbtack-icon').removeClass('thumbtack-icon').addClass("thumbtack-icon-active");
    $(fork).find('.thumbtack-icon-active').click(unPinFork);
    numberOfPinnedPosts++;
    $(fork).prependTo("#container");
    console.log('Количество незакрепленных постов: ' + $('.thumbtack-icon').length);
    console.log('Количество закрепленных постов: ' + $('.thumbtack-icon-active').length);
    console.log('Переменная закрепленных постов: ' + numberOfPinnedPosts);
    console.log($('.thumbtack-icon.active'));

  }

 function unPinFork() {

   let fork = $(this).closest('.fork').clone();
   $(this).closest('.fork').remove();
   console.log(fork);
   $(fork).find('.thumbtack-icon-active').removeClass("thumbtack-icon-active").addClass("thumbtack-icon");
   $(fork).find('.thumbtack-icon').click(pinFork);
   numberOfPinnedPosts--;
   if (numberOfPinnedPosts === 0)  {
     $(fork).prependTo("#container");
   } else  {
     $(".fork:nth-child(" + numberOfPinnedPosts + ")").after($(fork));
   }
   console.log('Количество незакрепленных постов' + $('.thumbtack-icon').length);
   console.log('Количество закрепленных постов' + $('.thumbtack-icon-active').length);
   console.log('Переменная закрепленных постов: ' + numberOfPinnedPosts);
 }

  $( '.thumbtack-icon' ).click(pinFork);

  $('.thumbtack-icon-active').click(unPinFork);

});



