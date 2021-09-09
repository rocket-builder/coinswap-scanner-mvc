const cors = "https://cors-anywhere.herokuapp.com/";
//const api_url = "https://crypto-assist-api.herokuapp.com/";
const api_url = "http://127.0.0.1:8081/";

$('#btn-logout').click(() => {

  console.log('click');
  $.ajax({
    url:"php/controllers/logout-controller.php",
    type:"POST",
    data: {},
    success: function(response) {
        console.log(response);

        location.replace('index.html');
    },
    error: function(error) {
      console.log(error);
    }
  });
});

$('.ui.dropdown').dropdown();

$('.ui.checkbox').checkbox();

$('.btn-copy-code').click(function() {

  let code = $(this).prev().prev().val();
  console.log(code);

  $(this).prev().prev().select();

  document.execCommand("copy");
  $(this).transition('jiggle');
});
