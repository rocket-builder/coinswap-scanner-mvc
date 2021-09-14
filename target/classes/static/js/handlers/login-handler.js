$('#btn-login').click(() => {

  if($('#inp-login').val() !== '' && $('#inp-password').val() !== '') {
    let login = $('#inp-login').val().trim();
    let password = $('#inp-password').val().trim();

    $('#inp-form').prepend(loader);
    $.ajax({
      type: "POST",
      url: "/login",
      contentType: "application/json",
      data: JSON.stringify({
        login: login,
        password: password
      }),
      success: function(){
        location.reload();
      },
      error: function(error) {
        console.log(error);
        hideLoader();
        $('#error-login').html(error.responseText).transition('shake');
      }
    });
  } else {
    hideLoader();
    $('#error-login').html('Заполните все поля').transition('shake');
  }
});
