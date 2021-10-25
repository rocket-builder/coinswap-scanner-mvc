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

  let userJson = JSON.stringify({
    login: login,
    password: password
  });

  if(login != '' && password != ''){

    $('#btn-add-user').append(loader);
    $.ajax({
      url:api_url + "registration",
      type:"POST",
      contentType: "application/json",
      dataType: "json",
      data: userJson,
      success: function(response) {
        console.log(response);

        $('.second.modal').modal('show');
        let info = "login: "+login+'\n'+"password: "+password+'\n'+"id: "+response.id;
        console.log(info);
        $('#inp-user-login-info').html(info);

        hideLoader();
        $('#inp-user-login').val('');
        $('#inp-user-password').val('');
      },
      error: function(error) {
        console.log(error);
        hideLoader();
        $('#error-add-user').html(error.responseText).transition('shake');
      }
    });
  } else {
    hideLoader();
    $('#error-add-user').html('Заполните все поля').transition('shake');
  }
});

$('#btn-user-info-copy').click(() => {

  $('#inp-user-login-info').select();
  document.execCommand("copy");

  $('#btn-user-info-copy').html('Скопировано').transition('jiggle');
});
