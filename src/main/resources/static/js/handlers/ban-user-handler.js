$('.btn-ban-user').click(function(){

  let id = $(this).attr("id").split("_")[1];

  $.ajax({
    type:"POST",
    url:cors + api_url + "user("+id+").ban?token=" + getCookie('id'),
    success: function(response) {
        console.log(response);

        location.reload();
    },
    error: function(error) {
      console.log(error);
      $('#error-add-keys').html(error.responseText).transition('shake');
    }
  });
});

$('.btn-unban-user').click(function(){

  let id = $(this).attr("id").split("_")[1];

  $.ajax({
    type:"POST",
    url:cors + api_url + "user("+id+").unban?token=" + getCookie('id'),
    success: function(response) {
        console.log(response);

        location.reload();
    },
    error: function(error) {
      console.log(error);
      $('#error-add-keys').html(error.responseText).transition('shake');
    }
  });
});
