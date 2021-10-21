
const apiUrl = "https://api.commerce.coinbase.com/";
const token = "ffde81c3-cca7-4e48-b389-2ba1196b3a5a";

$('#btn-pay').click(function(){
  let object = {
    name: "coinswap app helper",
    description: "coinswap apphelper sub",
    pricing_type: "fixed_price",
    local_price: {
      amount: 400,
      currency: "USD"
    },
    metadata:{
      name: getCookie('login'),
      project: "linken"
    }
  };

  $.ajax({
    type:"POST",
    url: apiUrl + "charges",
    headers: {
        'X-CC-Api-Key': token,
        'X-CC-Version': '2018-03-22'
    },
    contentType: "application/json",
    data: JSON.stringify(object),
    dataType: "json",
    success: function(response) {
        console.log(response.data);

        let payUrl = response.data.hosted_url;
        window.open(payUrl, '_blank');
    },
    error: function(error) {console.log(error); }
  });
});
