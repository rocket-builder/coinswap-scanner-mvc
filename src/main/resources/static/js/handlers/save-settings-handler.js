
//TODO create exchange titles component

let exchanges = currentUser.settings.exchanges.fromCsv();
console.log(exchanges);

let platforms = currentUser.settings.platforms.fromCsv();
console.log(platforms);

let excludedExchanges = currentUser.settings.platforms.fromCsv();
console.log(excludedExchanges);

function getStockItemHtml(title){
  return '<div class="stock-item">' +
      '            <span class="stock-market__name">'+title+'</span>' +
      '            <i class="times circle outline icon stock-market-template__icon" onclick="removeExchange(this)"></i>' +
      '        </div>';
}

function renderExchanges(exchanges){
  let html = exchanges
      .filter(e => !e.isBlank())
      .map(e => getStockItemHtml(e)).join('');
  $('#markets').html(html);
}
function renderPlatforms(platforms){
  let html = platforms
      .filter(e => !e.isBlank())
      .map(e => getStockItemHtml(e)).join('');
  $('#platforms').html(html);
}
function renderExcludedExchanges(excludedExchanges){
  let html = excludedExchanges
      .filter(e => !e.isBlank())
      .map(e => getStockItemHtml(e)).join('');
  $('#excludedMarkets').html(html);
}
renderExchanges(exchanges);
renderPlatforms(platforms);
renderExcludedExchanges(excludedExchanges);

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
    $('#markets.stock-items').prepend(
        getStockItemHtml(exchange));
    $(this).val('');
  }
});
$('#btn-add-market').click(function () {
  let exchange = $('#inp-markets').val();
  $('#markets.stock-items').prepend(
      getStockItemHtml(exchange));
  $('#inp-markets').val('');
});
$('#btn-add-platform').click(function () {
  let exchange = $('#inp-platforms').val();
  $('#platforms.stock-items').prepend(
      getStockItemHtml(exchange));
  $('#inp-platforms').val('');
});
$('#inp-platforms').on('keydown', function(e) {
  if (e.which == 13 && !e.shiftKey) {
    e.preventDefault();

    let exchange = $(this).val();
    $('#platforms.stock-items').prepend(
        getStockItemHtml(exchange));
    $(this).val('');
  }
});
//Исправить внизу
$('#inp-excluded-markets').on('keydown', function(e) {
  if (e.which == 13 && !e.shiftKey) {
    e.preventDefault();

    let excludedExchange = $(this).val();
    $('#excludedMarkets.stock-items').prepend(
        getStockItemHtml(excludedExchange));
    $(this).val('');
  }
});
$('#btn-exclude-market').click(function () {
  let exchange = $('#inp-excluded-markets').val();
  $('#excludedMarkets.stock-items').prepend(
      getStockItemHtml(exchange));
  $('#inp-excluded-markets').val('');
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
        console.log("updated: " + currentUser.settings);

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

    platforms: Array.from($('#platforms .stock-market__name')).map(e => e.innerText).toCsv(),
    exchanges: Array.from($('#markets .stock-market__name')).map(e => e.innerText).toCsv(),
    excludedExchanges: Array.from($('#excludedMarkets .stock-market__name')).map(e => e.innerText).toCsv()
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


