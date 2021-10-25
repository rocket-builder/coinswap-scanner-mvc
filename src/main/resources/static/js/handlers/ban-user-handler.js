$('.btn-ban-user').click(function(){

  var id = $(this).attr("user-id");
  let banned = $(this).attr('banned') === 'true';
  console.log(banned);

  let userBanned = !banned;
  console.log(userBanned);

  //TODO do it work with one button
  $.ajax({
    type:"PUT",
    contentType: "application/json",
    url:api_url + "user/"+id+"/banned",
    data: JSON.stringify({
      id: id,
      banned: userBanned
    }),
    success: function(response) {
        console.log(response);

        //let color =
        //$('.btn-ban-user[user-id='+id+'] > i').css('color', '')
        //TODO Rerender btn and status
        location.reload();
    },
    error: function(error) {
      console.error(error);
    }
  });
});
