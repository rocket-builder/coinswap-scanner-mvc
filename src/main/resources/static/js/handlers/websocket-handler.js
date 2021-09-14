const socketUrl = "https://coinswap-scanner.herokuapp.com/ws/forks";
const currentUser = getCurrentUser();

function getColorByProfit(percent) {
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

    return color;
}

Number.prototype.isRangeMatch = function(min, max){
    let value = Number(this);

    if(Number(min) + Number(max) === 0){
        return true;
    }
    if(Number(min) === 0 && value <= Number(max)){
        return true;
    }
    if(value >= Number(min) && Number(max) === 0){
        return true;
    }

    return value >= Number(min) && value <= Number(max);
}
function isFilteredFork(fork) {
    let settings = currentUser.settings;
    let matched = false;

    if(
        fork.profitPercent.isRangeMatch(settings.minProfitPercent, settings.maxProfitPercent) &&

        fork.firstPair.volume24h.isRangeMatch(settings.minPairVolume, settings.maxPairVolume) &&
        fork.secondPair.volume24h.isRangeMatch(settings.minPairVolume, settings.maxPairVolume) &&

        fork.token.quote.usdPrice.volume24h.isRangeMatch(settings.minTokenVolume, settings.maxTokenVolume)
    ){
        matched = true;
    }
    return matched;
}
function getTokenForkHTML(fork) {

    let percent = Number(fork.profitPercent);
    let color = getColorByProfit(percent);

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

      let matched = isFilteredFork(fork);
      console.log("matched: " + matched);

      if(matched){
          let html = getTokenForkHTML(fork);
          $('#container').prepend(html);
          $('.forked').first().transition('fade in', '300ms');

          $('#signal-lamp').transition('flash', '300ms');
      }
});

hubConnection.start();
