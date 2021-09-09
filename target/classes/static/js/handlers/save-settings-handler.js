
$('#btn-save-settings').click(async function() {

  let url = api_url + 'user/' + getCookie('id');
  let response = await fetch(url);
  let user = await response.json();

  let swappers = [];
   $('.account[swapper-id]').each((i, swapper) => {
     let id = $(swapper).attr('swapper-preset-id');
     let swapperId = $(swapper).attr('swapper-id');

     let active = $(swapper).find('input[type="checkbox"]').parent().hasClass('checked');
     let tokenAmount = $(swapper).find('.inp-token-amount').val();
     let liquidity = $(swapper).find('.inp-liquidity-percent').val();

     let item = {
       id: id,
       swapper: {
         id: swapperId
       },
       active: active,
       minLiquidity: liquidity,
       minTokenAmount: tokenAmount
     };

     swappers.push(item);
   });

   console.log(swappers);

   let settings = {
     swappers: swappers
   };

  $.ajax({
    type:"PUT",
    contentType: "application/json",
    dataType: "json",
    url: api_url + "settings/user/" + getCookie('id'),
    data: JSON.stringify(settings),
    success: function(response) {
        console.log(response);

        $('#btn-save-settings').transition('flash');
    },
    error: function(error) {
      console.log(error);
      $('#error-add-telegram').html(error.responseText).transition('shake');
    }
  });
});
