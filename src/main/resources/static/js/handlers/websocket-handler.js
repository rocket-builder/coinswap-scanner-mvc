const socketUrl = "https://coinswap-scanner.herokuapp.com/ws/forks";

function getTokenForkHTML(fork) {

    let percent = Number(fork.profitPercent);
    let color = "#1FC58E";

    if (percent >= 20){
        color = "#FF8C00";
    }
    if (percent >= 50){
        color = "#DC143C";
    }
    if(percent >= 100){
        color = "#8A2BE2";
    }

  let html = '<div class="column forked">' +
      '        <div class="token-fork">' +
      '        <div class="token">' +
      '        '+fork.token.title+' <span>'+fork.token.symbol+'</span><br>' +
      '        <span>[</span>'+fork.token.platform.title+'<span>]</span>' +
      '        <p><i class="chart line icon"></i>$'+fork.token.quote.usdPrice.volume24h.toLocaleString()+'</p>' +
      '    </div>' +
      '    <div class="exchanges">' +
      '        <textarea rows="3">'+fork.firstPair.exchange.title+': '+fork.firstPair.title+'&#13;&#10;VOL: $'+fork.firstPair.volume24h.toLocaleString()+'&#13;&#10;P: $'+fork.firstPair.price+'</textarea>' +
      '        <textarea rows="3">'+fork.secondPair.exchange.title+': '+fork.secondPair.title+'&#13;&#10;VOL: $'+fork.secondPair.volume24h.toLocaleString()+'&#13;&#10;P: $'+fork.secondPair.price+'</textarea>' +
      '    </div>' +
      '    <div class="profit">' +
      '        <div class="percent" style="color:'+color+';">'+fork.profitPercent+'<i class="small icon percent"></i></div>' +
      '    </div>' +
      '    <a class="ui small fluid button token-btn" href="'+fork.url+'" target="_blank">' +
      '        <i class="icon eye token-open"></i>' +
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
      $('.forked').first().transition('fade in', '300ms');

      $('#signal-lamp').transition('flash', '300ms');
});

hubConnection.start();
