
//TODO create exchange titles component

let exchanges =  currentUser.settings.exchanges.fromCsv();
console.log(exchanges);


//TODO load exchanges array to page component, start

$.each(exchanges, function ( index, value ){
  $('.stock-market-template .stock-market-template__name').empty(); // Опустошаем имя в шаблоне
  $('.stock-market-template .stock-market-template__name').text( value ); //Вставляем имя в шаблон
  $( ".stock-market-template" ).clone().removeClass('stock-market-template') //Копируем шаблон, убираем класс шаблона
      .addClass('stock-market').children().first().removeClass('stock-market-template__name')//Меняем класс шаблона для дочернего элемента
      .addClass('stock-market__name').parent().appendTo( ".stock-markets" );// кидаем в конец списка бирж
})
let stockMarketsListItem = document.querySelectorAll('.stock-markets'); //Находим все добавленные биржи
$('.stock-market').on('click',function () { //Если нажали на биржу
  $( this ).remove(); //Она удаляется
})



$('.add-stock-markets-button').click(function () { //По клику на кнопку добавления биржи
  let inputValue = $('.stock-markets-search__input').val(); //Считываем значение внутри инпута
  if (inputValue == '') { //Ecли инпут пустой, прерываем добавление пустой биржи
    return false;
  }
  $('.stock-markets-search__input').val(''); //Очищаем инпут
  $('.stock-market-template .stock-market-template__name').empty(); //Опустошаем имя в шаблоне
  $('.stock-market-template .stock-market-template__name').text(inputValue); //Вставляем имя в шаблон
  $( ".stock-market-template" ).clone().removeClass('stock-market-template') //Копируем шаблон, убираем класс шаблона
      .addClass('stock-market').children().first().removeClass('stock-market-template__name')
      .addClass('stock-market__name').parent().appendTo( ".stock-markets" );//Добавляем класс элемента, кидаем в конец списка
  let stockMarketsListItem = document.querySelectorAll('.stock-market'); //Пересчитываем количество бирж
  $('.stock-market').on('click',function () { //Если нажали на биржу
    $( this ).remove(); //Она удаляется
  })


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
    //TODO get String array of exchange titles from page and use toCsv()
    exchanges: ($.map( $('.stock-market__name'), function( element, index ) {
      return element.innerText ;
    })).toCsv()  //Вытаскиваем массив имен бирж, для каждого находим его innerText и обрабатываем toCsv
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


