$('#btn-reg').click(function(){

if($('#inp-login').val() !== '' && $('#inp-password').val() !== '') {
  let login = $('#inp-login').val().trim();
  let password = $('#inp-password').val().trim();
  let telegram = $('#inp-telegram').val().trim();

  let isTelegramCheked = $('#inp-is-telegram-cheked').is(':checked');

  if(isTelegramCheked){
    $('#inp-form').prepend('<div class="ui active inverted dimmer" id="loader"><div class="ui loader"></div></div>');
    $.ajax({
      type:"POST",
      url:api_url + "registration",
      contentType: "application/json",
      data: JSON.stringify({
        login: login,
        password: password,
        telegramId: telegram
      }),
      dataType: "json",
      success: function(response) {
          console.log(response);

          $('#loader').transition({
            animation  : 'fade out',
            onComplete : function() {
              $('.loader').remove();
            }
          });

          $('#inp-user-login-info').val("login: "+login+'\n'+"password: "+password+'\n'+"id: "+response.id+'\n');
          $('#reg-info-modal').modal('show');
      },
      error: function(error) {
        $('#loader').transition({
          animation  : 'fade out',
          onComplete : function() {
            $('#loader').remove();
          }
        });
        $('#error-reg').html(error.responseText).transition('shake');
      }
    });
  } else {
      $('#error-reg').html('Подпишитесь на <a href="https://tg-me.ru/amazon_dreamer_bot" target="_blank">@amazon_dreamer_bot</a>').transition('shake');
  }
} else {
  $('#error-reg').html('Заполните все поля').transition('shake');
}
});

$('#btn-user-info-copy').click(() => {

  $('#inp-user-login-info').select();
  document.execCommand("copy");

  $('#btn-user-info-copy').html('Скопировано').transition('jiggle');
});
