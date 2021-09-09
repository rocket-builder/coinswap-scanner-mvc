const socketUrl = "https://localhost:5001/ws/forks";

function getTokenForkHTML(fork) {
  //TODO FULL RENDER COMPONENT
  let html = '<div class="column"> <div class="token-fork"> <div class="token"> '+fork.token.title+' <span>'+fork.token.symbol+'</span><br> <span>[</span>'+fork.token.platform.title+'<span>]</span> </div> <div class="exchanges"> <input type="text" value="'+fork.firstExchange.title+': '+fork.firstQuote.usdPrice.price+'$"/> <br><br> <input type="text" value="'+fork.secondExchange.title+': '+fork.secondQuote.usdPrice.price+'$"/> </div> <div class="profit"> <div class="percent">'+fork.profitPercent+'<i class="small icon percent"></i></div> </div> <a class="ui small fluid button token-btn" href="'+fork.url+'"> <i class="icon arrow alternate circle right outline token-open"></i> </a> </div> </div>';

  return html;
}

const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(socketUrl, {
              skipNegotiation: true,
              transport: signalR.HttpTransportType.WebSockets
            })
            .build();

hubConnection.on("Send", function (fork) {
      console.log(fork);

      let html = getTokenForkHTML(fork);
      $('#container').prepend(html);
});

hubConnection.start();
