$('#btn-reg').click(function(){

if($('#inp-login').val() !== '' && $('#inp-password').val() !== '') {
  let login = $('#inp-login').val().trim();
  let password = $('#inp-password').val().trim();
  let telegram = $('#inp-telegram').val().trim();

  $('#inp-form').prepend(loader);
  $.ajax({
    type:"POST",
    url:api_url + "registration",
    contentType: "application/json",
    data: JSON.stringify({
      login: login,
      password: password,
      telegramId: telegram
    }),
    success: function(){
      location.reload();
    },
    error: function(error) {
      hideLoader();
      $('#error-reg').html(error.responseText).transition('shake');
    }
  });
} else {
  $('#error-reg').html('Заполните все поля').transition('shake');
}
});
