const socketUrl = "https://coinswap-scanner.herokuapp.com/ws/forks";

function getTokenForkHTML(fork) {
  let html = '<div class="column">' +
      '        <div class="token-fork">' +
      '        <div class="token">' +
      '        '+fork.token.title+' <span>'+fork.token.symbol+'</span><br>' +
      '        <span>[</span>'+fork.token.platform.title+'<span>]</span>' +
      '    </div>' +
      '    <div class="exchanges">' +
      '        <textarea rows="2">'+fork.firstPair.exchange.title+': '+fork.firstPair.title+'&#13;&#10;'+fork.firstPair.price+'$</textarea>' +
      '    <p><i class="clock icon time-icon"></i><span>'+fork.firstPair.updated+'</span></p>' +
      '        <textarea rows="2">'+fork.secondPair.exchange.title+': '+fork.secondPair.title+'&#13;&#10;'+fork.secondPair.price+'$</textarea>' +
      '    <p><i class="clock icon time-icon"></i><span>'+fork.secondPair.updated+'</span></p>' +
      '    </div>' +
      '    <div class="profit">' +
      '        <div class="percent">'+fork.profitPercent+'<i class="small icon percent"></i></div>' +
      '    </div>' +
      '    <a class="ui small fluid button token-btn" href="'+fork.url+'" target="_blank">' +
      '        <i class="icon arrow alternate circle right outline token-open"></i>' +
      '        </a>' +
      '        </div>' +
      '        </div>';

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

      $('#signal-lamp').transition('flash', '300ms');
});

hubConnection.start();
