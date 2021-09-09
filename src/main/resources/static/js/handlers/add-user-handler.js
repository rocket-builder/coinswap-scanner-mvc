function getSubscribeEndDate() {

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 2).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

return yyyy+'-'+mm+'-'+dd;
}

$('.coupled.modal')
  .modal({
    allowMultiple: false
  });
// attach events to buttons
// $('.second.modal')
//   .modal('attach events', '.first.modal .button');

$('#btn-add-user-modal').click(() => {

  $('#add-user-modal')
      .modal('setting', 'transition', 'fly up')
      .modal('show');
});

$('#btn-add-user').click(() => {

  let login = $('#inp-user-login').val();
  let password = $('#inp-user-password').val();

  let data = JSON.stringify({
    login: login,
    password: password,
    telegramId: 0
  });

  if(login != '' && password != ''){

    $('#btn-add-user').append('<div class="ui active inverted dimmer" id="loader" style="border-radius: 60px;"><div class="ui loader"></div></div>');
    $.ajax({
      url:cors + api_url + "users.add",
      type:"POST",
      contentType: "application/json",
      dataType: "json",
      data: data,
      success: function(response) {
          console.log(response);

          if(response.code != undefined){
            $('#loader').transition({
              animation  : 'fade out',
              onComplete : function() {
                $('#loader').remove();
              }
            });
            $('#error-add-user').html(response.message).transition('shake');
          } else {

            $('.second.modal').modal('show');
            $('#inp-user-login-info').val("login: "+login+'\n'+"password: "+password+'\n'+"id: "+response.id+'\n'+"token: "+response.token).transition('fade in');

            $('#loader').transition({
              animation  : 'fade out',
              onComplete : function() {
                $('#loader').remove();
              }
            });
            $('#inp-user-login').val('');
            $('#inp-user-password').val('');
          }
      },
      error: function(error) {
        console.log(error);
        $('#loader').transition({
          animation  : 'fade out',
          onComplete : function() {
            $('#loader').remove();
          }
        });

        $('#error-add-user').html(error.responseText).transition('shake');
      }
    });
  } else {
    $('#loader').transition({
      animation  : 'fade out',
      onComplete : function() {
        $('#loader').remove();
      }
    });
    $('#error-add-user').html('Заполните все поля').transition('shake');
  }
});

$('#btn-user-info-copy').click(() => {

  $('#inp-user-login-info').select();
  document.execCommand("copy");

  $('#btn-user-info-copy').html('Скопировано').transition('jiggle');
});
