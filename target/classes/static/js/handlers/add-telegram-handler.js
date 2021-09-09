
const telegramRegex = /^\d*$/;

String.prototype.isDigits = function() {
    return telegramRegex.test(this);
};

$('#btn-add-telegram').click(function(){

  const telegramId = $('#inp-telegram').val();

  if((telegramId !== "" || telegramId === "0") && telegramId.isDigits()){
    $.ajax({
      type:"POST",
      contentType: "application/json",
      dataType: "json",
      url: api_url + "user/" + getCookie('id') + "/telegram",
      data: JSON.stringify(telegramId),
      success: function(response) {
          console.log(response);

          $('#inp-telegram').transition('flash');
      },
      error: function(error) {
        console.log(error);
        $('#error-add-telegram').html(error.responseText).transition('shake');
      }
    });
  } else {
    $('#error-add-telegram').html('Некорректный ввод').transition('shake');                      t
  }
});
