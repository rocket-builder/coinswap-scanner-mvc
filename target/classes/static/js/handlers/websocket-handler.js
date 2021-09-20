const socketUrl = "https://coinswap-scanner.herokuapp.com/ws/forks";
const maxForkCount = currentUser.settings.maxForkCountOnPage;

Array.prototype.removeById = function(forkId){
    const index = this.findIndex(fork => fork.id.trim() === forkId.trim());
    if (index > -1) {
        this.splice(index, 1);
    }
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
String.prototype.isBannedPair = function (bannedPairs) {
    return bannedPairs.find(pair => pair.title.trim() === this.trim()) !== undefined;
}

function isFilteredFork(fork) {
    let settings = currentUser.settings;
    let matched = false;

    if(
        fork.profitPercent.isRangeMatch(settings.minProfitPercent, settings.maxProfitPercent) &&

        fork.firstPair.volume24h.isRangeMatch(settings.minPairVolume, settings.maxPairVolume) &&
        fork.secondPair.volume24h.isRangeMatch(settings.minPairVolume, settings.maxPairVolume) &&

        fork.token.quote.usdPrice.volume24h.isRangeMatch(settings.minTokenVolume, settings.maxTokenVolume) &&

        !fork.firstPair.title.isBannedPair(settings.bannedPairs) &&
        !fork.secondPair.title.isBannedPair(settings.bannedPairs)
    ){
        matched = true;
    }
    return matched;
}

var forks = [];
function initStorage() {
    let json = localStorage.getItem("forks");

    if(json === null || json === undefined) {
        json = JSON.stringify(forks);
        localStorage.setItem("forks", json);

        console.log('init storage');
    } else {
        forks = JSON.parse(json);
        console.log('retrieve storage');
        console.log(forks);
    }
}
initStorage();
renderForksFromStorage();

function saveForkInStorage(fork) {
    forks.push(fork);
    let json = JSON.stringify(forks);

    localStorage.setItem("forks", json);
    console.log('saved in storage');
}

function removeForkFromStorageById(forkId) {
    forks.removeById(forkId);
    let json = JSON.stringify(forks);

    localStorage.setItem("forks", json);
    console.log('deleted from storage');
}

function renderForksFromStorage() {
    let html = "";

    forks.sort(function(a,b){
        return new Date(b.recieveDate) - new Date(a.recieveDate);
    })
        .slice(0, maxForkCount - 1)
        .forEach((fork) => {
            if(isFilteredFork(fork)){
                html += getTokenForkHTML(fork);
            }
    });

    $('#container').append(html);
}

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
function getTokenForkHTML(fork) {
    let percent = Number(fork.profitPercent);
    let color = getColorByProfit(percent);

    let html = '<div class="column forked" fork-id="'+fork.id+'">' +
        '        <div class="token-fork">' +
        '           <input class="fork-lifetime" size="6" maxlength="9" value="'+getCurrentLifetimeString(fork.recieveDate)+'" receive-date="'+fork.recieveDate+'" disabled/>' +
        '        <div class="token">' +
        '        ' + fork.token.title + ' <span>' + fork.token.symbol + '</span><br>' +
        '        <span>[</span>' + fork.token.platform.title + '<span>]</span>' +
        '        <p><i class="chart line icon"></i>$' + fork.token.quote.usdPrice.volume24h.toLocaleString() + '</p>' +
        '    </div>' +
        '    <div class="exchanges">' +
        '        <textarea rows="3">' + fork.firstPair.exchange.title + ': ' + fork.firstPair.title + '&#13;&#10;VOL: $' + fork.firstPair.volume24h.toLocaleString() + '&#13;&#10;P: $' + fork.firstPair.price + '</textarea>' +
        '        <textarea rows="3">' + fork.secondPair.exchange.title + ': ' + fork.secondPair.title + '&#13;&#10;VOL: $' + fork.secondPair.volume24h.toLocaleString() + '&#13;&#10;P: $' + fork.secondPair.price + '</textarea>' +
        '    </div>' +
        '    <div class="profit">' +
        '        <div class="percent" style="color:' + color + ';">' + fork.profitPercent + '<i class="small icon percent"></i></div>' +
        '    </div>' +
        '    <a class="ui small button token-btn btn-delete-fork" onclick="deleteFork(this)">' +
        '        <i class="icon trash alternate outline token-open"></i>' +
        '        </a>' +
        '    <a class="ui small button token-btn btn-ban-fork" fork-pairs="'+fork.firstPair.title+';'+fork.secondPair.title+'" onclick="banPairs(this)">' +
        '        <i class="icon eye slash outline token-open"></i>' +
        '        </a>' +
        '    <a class="ui small button token-btn open-link" href="' + fork.url + '" target="_blank">' +
        '        <i class="icon arrow right token-open"></i>' +
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
            //.withAutomaticReconnect()
            .build();

hubConnection.on("Send", function (forkList) {
      console.log(forkList);

      $('#signal-lamp').transition('flash', '300ms');

      forkList.items.forEach((fork) => {
          fork.id = generateUUID();
          console.log(fork);

          let matched = isFilteredFork(fork);
          console.log("matched: " + matched);

          if(matched){
              saveForkInStorage(fork);

              let html = getTokenForkHTML(fork);
              $('#container').prepend(html);

              $('[fork-id='+fork.id+']').transition('fade in', '300ms');

              forkLifetimeTimerInit(fork);

              if($('.forked').length > maxForkCount){
                  console.log('delete last fork');
                  $('.forked').last().remove();
              }
          }
      });
});

function start() {
    try{
        hubConnection.start();
    } catch (error) {
        console.log(error);
        reconnect();
    }
}
function reconnect(){
    setTimeout(function () {
        hubConnection.start();
    }, 5000);
}
hubConnection.onclose(function() {
    console.log('restart signalR connection');
    reconnect();
});

start();
