
$('#btn-save-settings').click(function() {

  const settingsId = $(this).attr('settings-id');
  const settings = getSettingsFromFields(settingsId);
  console.log(settings);

  // if(!validateSettings(settings)){
  //   $('#error-save-settings').html("Минимум не может быть больше максимума").transition('shake');
  //   return;
  // }

  $('#settings-form').addClass('loading');
  $.ajax({
    type:"PUT",
    contentType: "application/json",
    dataType: "json",
    url: api_url + "user/settings",
    data: JSON.stringify(settings),
    success: function(response) {
        console.log(response);
        $('#settings-form').removeClass('loading');
    },
    error: function(error) {
      console.log(error);
      $('#settings-form').removeClass('loading');
      $('#error-save-settings').html(error.responseText).transition('shake');
    }
  });
});

function getSettingsFromFields(id) {
  return {
    id: id,
    minProfitPercent: $('#inp-min-profit').val(),
    maxProfitPercent: $('#inp-max-profit').val(),

    minTokenVolume: $('#inp-min-token-volume').val(),
    maxTokenVolume: $('#inp-max-token-volume').val(),

    minPairVolume: $('#inp-min-pair-volume').val(),
    maxPairVolume: $('#inp-max-pair-volume').val()
  };
}

// function validateSettings(settings) {
//   let valid = false;
//   if(
//       Number(settings.minProfitPercent) <= Number(settings.maxProfitPercent) || Number(settings.maxProfitPercent) === 0 &&
//       Number(settings.minTokenVolume) <= Number(settings.maxTokenVolume) || Number(settings.maxTokenVolume) === 0 &&
//       Number(settings.minPairVolume) <= Number(settings.maxPairVolume) || Number(settings.maxPairVolume) === 0
//   ){
//     valid = true;
//   }
//   return valid;
// }
