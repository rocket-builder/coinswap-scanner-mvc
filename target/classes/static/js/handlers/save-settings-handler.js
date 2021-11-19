
//TODO create exchange titles component

let exchanges = currentUser.settings.exchanges.fromCsv();
console.log(exchanges);

function getExchangeHtml(exchange){
  return '<div class="stock-market">' +
      '            <span class="stock-market__name">'+exchange+'</span>' +
      '            <i class="times circle outline icon stock-market-template__icon" onclick="removeExchange(this)"></i>' +
      '        </div>';
}

function renderExchanges(exchanges){
  let html = exchanges
      .filter(e => !e.isBlank())
      .map(e => getExchangeHtml(e)).join('');
  $('.stock-markets').html(html);
}
renderExchanges(exchanges);

function removeExchange(element){
  $(element).parent().transition({
    animation  : 'fade out',
    onComplete : function() {
      $(element).parent().remove();
    }
  });
}

$('#inp-markets').on('keydown', function(e) {
  if (e.which == 13 && !e.shiftKey) {
    e.preventDefault();

    let exchange = $(this).val();
    $('.stock-markets').prepend(
        getExchangeHtml(exchange));
    $(this).val('');
  }
});
$('#btn-add-market').click(function () {
  let exchange = $('#inp-markets').val();
  $('.stock-markets').prepend(
      getExchangeHtml(exchange));
  $('#inp-markets').val('');
});

$('#open-settings-btn').click(function () {
  $('#settings-form')
      .modal({
        closable: false
      })
      .modal('show');
});

$('#btn-save-settings').click(function() {

  const settingsId = $(this).attr('settings-id');
  const settings = getSettingsFromFields(settingsId);
  console.log(settings);

  // if(!validateSettings(settings)){
  //   $('#error-save-settings').html("Минимум не может быть больше максимума").transition('shake');
  //   return;
  // }

  $('.ui.form').addClass('loading');
  $.ajax({
    type:"PUT",
    contentType: "application/json",
    dataType: "json",
    url: api_url + "user/settings",
    data: JSON.stringify(settings),
    success: function(response) {
        console.log(response);
        $('.ui.form').removeClass('loading');

        user.settings = response;
        currentUser.settings = response;
        console.log("updated: " + currentUser);

        if($('#settings-form').hasClass('settings-need-filter')){
          refreshForksFromSettings();
          $('#settings-form').modal('hide');
        }
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
    maxPairVolume: $('#inp-max-pair-volume').val(),

    maxForkCountOnPage: $('#inp-max-forks-count').val(),

    bannedPairs: currentUser.settings.bannedPairs,

    exchanges: Array.from($('.stock-market__name')).map(e => e.innerText).toCsv()
  };
}

$('#btn-clear-banned-pairs').click(function () {
  currentUser.settings.bannedPairs = [];

  $(this).addClass('loading');
  $.ajax({
    type:"PUT",
    contentType: "application/json",
    dataType: "json",
    url: api_url + "user/settings",
    data: JSON.stringify(currentUser.settings),
    success: function(response) {
      console.log(response);
      $('#btn-clear-banned-pairs').removeClass('loading');
    },
    error: function(error) {
      console.log(error);
      $('#btn-clear-banned-pairs').removeClass('loading');
    }
  });
});

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


