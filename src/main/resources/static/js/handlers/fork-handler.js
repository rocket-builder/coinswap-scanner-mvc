const storeUrl = "https://coinswap-scanner-store.herokuapp.com/";

const forksStoreUrl = storeUrl + "forks";
const cacheStore = "forks";

const maxForkCount = currentUser.settings.maxForkCountOnPage;
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
String.prototype.containsIgnoreCase = function (title) {
    return this.length > 0? this.toLowerCase().includes(title.toLowerCase()) : true;
}
String.prototype.excludesIgnoreCase = function (title) {
    return this.length > 0? (!this.toLowerCase().includes(title.toLowerCase())) : true;
}
Map.prototype.concat = function (map) {
    return new Map([...this, ...map]);
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
        !fork.secondPair.title.isBannedPair(settings.bannedPairs) &&

        settings.exchanges.containsIgnoreCase(fork.firstPair.exchange.title) &&
        settings.exchanges.containsIgnoreCase(fork.secondPair.exchange.title) &&
        settings.platforms.containsIgnoreCase(fork.token.platform.title) &&
        settings.excludedExchanges.excludesIgnoreCase(fork.firstPair.exchange.title) &&
        settings.excludedExchanges.excludesIgnoreCase(fork.second.exchange.title)
    ){
        matched = true;
    }
    return matched;
}

var forks = new Map();
var cachedForks = new Map();
var allForks = new Map();

var init = Boolean(sessionStorage.getItem("init"));
function initStorage() {
    if(init === false){
        $('#container').addClass("form loading");

        caches.open(cacheStore).then(async (cache) => {
            await cache.add(forksStoreUrl);
            cache.match(forksStoreUrl)
                .then(response => response.json())
                .then(storageForks => {
                    storageForks = new Map(Object.entries(storageForks));
                    sessionStorage.setItem("init", "true");
                    sessionStorage.setItem("forks", "{}");

                    console.log("Received " + storageForks.size + " forks");
                    renderFilteredForks(Array.from(storageForks.entries()));

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
                .then(cache => {
                    cachedForks = new Map(Object.entries(cache));
                    forks = new Map(
                        Object.entries(JSON.parse(sessionStorage.getItem("forks"))));
                    allForks = forks.concat(cachedForks);

                    console.log("retrieved " + allForks.size + " forks from storage");

                    renderFilteredForks(Array.from(allForks.entries()));
                }).then(() =>
                    startSignalR())
                .then(() =>
                    resetForksLifetimeInterval());
        });
    }
}
initStorage();

function saveForksInStorage(forksList) {
    try {
        forks = forks.concat(forksList);

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
    forks.delete(forkId)
    let json = JSON.stringify(forks);

    sessionStorage.setItem("forks", json);
    //console.log('deleted from storage');
}

function renderFilteredForks(forks) {
    console.log(forks);

    let filtered = forks
        .filter(pair => isFilteredFork(pair[1]))
        .slice(0, maxForkCount);

    filtered.sort((a,b) =>
        new Date(b[1].recieveDate) - new Date(a[1].recieveDate));

    if(filtered.length > 0){
        let forksDivs = Array.from(document.querySelectorAll('[fork-id]'));
        forksDivs
            .slice(Math.abs(forksDivs.length - filtered.length))
            .forEach(f => f.remove());

        let html = filtered.map(pair => getForkHTML(pair)).join("");

        document.querySelector("#container")
            .insertAdjacentHTML("afterbegin", html);
    }
}

function refreshForksFromSettings() {
    let filtered =
        Array.from(forks.concat(cachedForks).entries())
            .filter(pair => isFilteredFork(pair[1]))
            .slice(0, maxForkCount);
    filtered.sort((a,b) =>
        new Date(b[1].recieveDate) - new Date(a[1].recieveDate));

    let html = filtered.map(pair => getForkHTML(pair)).join("");

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

jQuery.fn.outer = function() {
    return $($('<div></div>').html(this.clone())).html();
}

function getForkHTML(pair) {
    let id = pair[0];
    let fork = pair[1];
    let percent = Number(fork.profitPercent);
    //let color = getColorByProfit(percent);

    let elem = document.createElement('div'); //Cоздаем элемент
    elem.classList.add("fork");
    elem.classList.add("forked");//Добавляем класс "fork"
    elem.append(tmpl.content.cloneNode(true)); // Клонируем содержимое шаблона для того, чтобы переиспользовать его несколько раз

    let minPair = fork.firstPair;
    let maxPair = fork.secondPair;
    if(fork.firstPair.price > fork.secondPair.price){
        minPair = fork.secondPair;
        maxPair = fork.firstPair;
    }

    $(elem).attr('fork-id', id);
    $(elem).find('.fork-template__first-token-name a').text(minPair.exchange.title + ': ' + minPair.title);
    $(elem).find('.fork-template__first-token-name a').attr('href', minPair.url);

    $(elem).find('.fork-template__second-token-name a').text(maxPair.exchange.title + ': ' + maxPair.title);
    $(elem).find('.fork-template__second-token-name a').attr('href', maxPair.url);

    $(elem).find('.fork-template__first-volume').text('VOL: $' + minPair.volume24h.toLocaleString());
    $(elem).find('.fork-template__second-volume').text('VOL: $' + maxPair.volume24h.toLocaleString());
    $(elem).find('.fork-template__first-price').text('P: $' + minPair.price);
    $(elem).find('.fork-template__second-price').text('P: $' + maxPair.price);
    $(elem).find('.fork-template__sale-benefit').text(fork.profitPercent + '%');
    /*$(elem).find('.fork-template__time').text(getCurrentLifetimeString(fork.recieveDate));*/

    $(elem).find('.template__token-title').text(fork.token.title);//Добавляем названия биржи
    $(elem).find('.template__token-symbol').text(fork.token.symbol); //Добвляем символьное представление биржи
    $(elem).find('.template__token-platform-title').text(fork.token.platform.title); //Добавляем заголовок платформы
    $(elem).find('.template__token-price').text(fork.token.quote.usdPrice.volume24h.toLocaleString());

    $(elem).find('.template__token-time').attr('value', getCurrentLifetimeString(fork.recieveDate));
    $(elem).find('.template__token-time').attr('receive-date', fork.recieveDate);

    $(elem).find('a.fork-link').attr('href', fork.url);
    $(elem).find('.remove-fork-btn').attr('onclick', "deleteFork(this)");
    $(elem).find('.hide-fork-btn').attr('onclick', "banPairs(this)");
    $(elem).find('.hide-fork-btn').attr('fork-pairs', minPair.title + ";" + maxPair.title);

    $('#container').prepend(elem); //Добавляем контейнеру вилку
}
