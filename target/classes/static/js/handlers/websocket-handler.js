const storeUrl = "https://coinswap-scanner-store.herokuapp.com/";

//const socketUrl = "https://coinswap-scanner.azurewebsites.net/ws/forks";
//const socketUrl = "https://localhost:5001/ws/forks";
const socketUrl = "https://coinswapscanner.ngrok.io/ws/forks";

const forksStoreUrl = storeUrl + "forks";
const cacheStore = "forks";

const maxForkCount = currentUser.settings.maxForkCountOnPage;

const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(socketUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
    })
    //.withAutomaticReconnect()
    .build();

hubConnection.on("Send", function (forkList) {
    console.log(forkList);
    saveForksInStorage(forkList.items);

    let forks = forkList.items
        .filter(f => isFilteredFork(f));
    if(forks.length > 0){
        $('#signal-lamp').transition('flash', '300ms');
        renderFilteredForks(forks);
        resetForksLifetimeInterval();

        $('#container').transition('fade in', '300ms');
    }
});

function startSignalR() {
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
var cachedForks = [];

var init = Boolean(sessionStorage.getItem("init"));

function initStorage() {
    if(init === false){
        $('#container').addClass("form loading");

        caches.open(cacheStore).then(async (cache) => {
            await cache.add(forksStoreUrl);
            cache.match(forksStoreUrl)
                .then(response => response.json())
                .then(storageForks => {
                    sessionStorage.setItem("init", "true");
                    sessionStorage.setItem("forks", "[]");

                    console.log(storageForks);
                    renderFilteredForks(storageForks);

                    $('#container').removeClass("form loading");

                    cachedForks = storageForks;
                });
        }).then(() =>
            startSignalR())
          .then(() =>
            resetForksLifetimeInterval());
    } else {
        caches.open(cacheStore).then(async (cache) => {
            cache.match(forksStoreUrl)
                .then(response => response.json())
                .then(cachedForks => {
                    forks = JSON.parse(sessionStorage.getItem("forks"));
                    let forRender = forks.concat(cachedForks);

                    console.log(forRender);
                    console.log("retrieve storage");

                    renderFilteredForks(forRender);
                }).then(() =>
                    startSignalR())
                .then(() =>
                    resetForksLifetimeInterval());
        });
    }
}
initStorage();

function saveForksInStorage(forksList) {
    try{
        forks.pushArray(forksList);
        let json = JSON.stringify(forks);

        sessionStorage.setItem("forks", json);
    } catch (error) {
        console.error(error);

        sessionStorage.removeItem("forks");
        sessionStorage.removeItem("init");
        console.log("initiate cache sync");
        window.location.reload();
    }
}

function removeForkFromStorageById(forkId) {
    forks.removeById(forkId);
    let json = JSON.stringify(forks);

    sessionStorage.setItem("forks", json);
    //console.log('deleted from storage');
}

function renderFilteredForks(forks) {
    let filtered = forks
        .filter(f => isFilteredFork(f))
        .slice(0, maxForkCount);
    filtered.sort((a,b) =>
        new Date(b.recieveDate) - new Date(a.recieveDate));

    if(filtered.length > 0){
        let forksDivs = Array.from(document.querySelectorAll('[fork-id]'));
        forksDivs
            .slice(Math.abs(forksDivs.length - filtered.length))
            .forEach(f => f.remove());

        let html = filtered.map(f => getForkHTML(f)).join("");

        document.querySelector("#container")
            .insertAdjacentHTML("afterbegin", html);
    }
}

function refreshForksFromSettings() {
    let filtered =
        forks.concat(cachedForks)
            .filter(f => isFilteredFork(f))
            .slice(0, maxForkCount);
    filtered.sort((a,b) =>
        new Date(b.recieveDate) - new Date(a.recieveDate));

    let html = filtered.map(f => getForkHTML(f)).join("");

    document.querySelector("#container").innerHTML = "";
    document.querySelector("#container")
        .insertAdjacentHTML("afterbegin", html);

    resetForksLifetimeInterval();
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
function getForkHTML(fork) {
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
        '        <p class="pair"><a href="'+fork.firstPair.url+'" target="_blank">' + fork.firstPair.exchange.title + ': ' + fork.firstPair.title + '</a><br>VOL: $' + fork.firstPair.volume24h.toLocaleString() + '<br>P: $' + fork.firstPair.price + '</p>' +
        '        <p class="pair"><a href="'+fork.secondPair.url+'" target="_blank">' + fork.secondPair.exchange.title + ': ' + fork.secondPair.title + '</a><br>VOL: $' + fork.secondPair.volume24h.toLocaleString() + '<br>P: $' + fork.secondPair.price + '</p>' +
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
