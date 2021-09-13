$('input.inp-sub-date').change(function() {
  $(this).parents().eq(0).prepend(loaderSmall);

  let date = $(this).val();
  let userId = $(this).attr('user-id');

  console.log(date);
  $.ajax({
    type:"PUT",
    url: api_url + "user/"+ userId + "/subscribe?date=" + date,
    dateType: "json",
    success: function(response) {
        console.log(response);

        hideLoader();
        $('input.inp-sub-date[user-id='+userId+']').transition('fade in');
    },
    error: function(error) {
      console.log(error);
      $('#loader').remove();
    }
  });
});
