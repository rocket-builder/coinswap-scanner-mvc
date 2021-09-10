//const api_url = "http://127.0.0.1:8081/";
const api_url = "/";

const loaderSmall = '<div class="ui active inverted dimmer" id="loader"><div class="ui loader small"></div></div>';
const loader = '<div class="ui active inverted dimmer" id="loader"><div class="ui loader"></div></div>';
const user = getSessionUser();

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
