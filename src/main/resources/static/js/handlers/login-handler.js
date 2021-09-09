$('#btn-login').click(() => {

  if($('#inp-login').val() !== '' && $('#inp-password').val() !== '') {
    let login = $('#inp-login').val().trim();
    let password = $('#inp-password').val().trim();

    $('#inp-form').prepend('<div class="ui active inverted dimmer" id="loader"><div class="ui loader"></div></div>');
    $.ajax({
      type:"POST",
      url:api_url + "login",
      contentType: "application/json",
      data: JSON.stringify({
        login: login,
        password: password
      }),
      dataType: "json",
      success: function(response) {
          console.log(response);

          setCookie('id', response.id);
          setCookie('login', login);
          setCookie('password', response.password);

          $('#loader').transition({
            animation  : 'fade out',
            onComplete : function() {
              $('.loader').remove();
            }
          });

          location.replace('profile.html');
      },
      error: function(error) {
        console.log(error);
        $('#loader').transition({
          animation  : 'fade out',
          onComplete : function() {
            $('#loader').remove();
          }
        });
        $('#error-login').html(error.responseText).transition('shake');
      }
    });
  } else {
    $('#loader').transition({
      animation  : 'fade out',
      onComplete : function() {
        $('#loader').remove();


      }
    });
    $('#error-login').html('Заполните все поля').transition('shake');
  }
});
