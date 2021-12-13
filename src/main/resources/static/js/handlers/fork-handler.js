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

/*let json = ' [\n' +
    '            "55877",\n' +
    '            {\n' +
    '                "token": {\n' +
    '                    "id": 122,\n' +
    '                    "title": "Synthetix",\n' +
    '                    "slug": "synthetix-network-token",\n' +
    '                    "symbol": "SNX",\n' +
    '                    "platform": {\n' +
    '                        "id": 0,\n' +
    '                        "type": 0,\n' +
    '                        "title": "Ethereum"\n' +
    '                    },\n' +
    '                    "quote": {\n' +
    '                        "usdPrice": {\n' +
    '                            "price": 5.54,\n' +
    '                            "volume24h": 58974572,\n' +
    '                            "updated": 1639228967770\n' +
    '                        }\n' +
    '                    }\n' +
    '                },\n' +
    '                "firstPair": {\n' +
    '                    "title": "SNX/USDT",\n' +
    '                    "url": "https://www.bitget.com/en/swap/cmt_snxusdt",\n' +
    '                    "exchange": {\n' +
    '                        "id": 0,\n' +
    '                        "title": "Bitget",\n' +
    '                        "quote": {\n' +
    '                            "usdPrice": {\n' +
    '                                "price": 0,\n' +
    '                                "volume24h": 0,\n' +
    '                                "updated": 1639228967736\n' +
    '                            }\n' +
    '                        }\n' +
    '                    },\n' +
    '                    "updated": 1639228967736,\n' +
    '                    "price": 5.51,\n' +
    '                    "volume24h": 108899\n' +
    '                },\n' +
    '                "secondPair": {\n' +
    '                    "title": "SNX/USDT",\n' +
    '                    "url": "https://www.bvnex.com/#/trade/snx_usdt",\n' +
    '                    "exchange": {\n' +
    '                        "id": 0,\n' +
    '                        "title": "Bvnex",\n' +
    '                        "quote": {\n' +
    '                            "usdPrice": {\n' +
    '                                "price": 0,\n' +
    '                                "volume24h": 0,\n' +
    '                                "updated": 1639228967738\n' +
    '                            }\n' +
    '                        }\n' +
    '                    },\n' +
    '                    "updated": 1639228967738,\n' +
    '                    "price": 12.3,\n' +
    '                    "volume24h": 1303729\n' +
    '                },\n' +
    '                "profitPercent": 76.249,\n' +
    '                "url": "https://coinmarketcap.com/currencies/synthetix-network-token/markets/",\n' +
    '                "recieveDate": 1639228967950\n' +
    '            }\n' +
    '        ]';



console.log(json);
for (let i = 0 ; i < 20; i ++)  {
    getForkHTML(JSON.parse(json));
}
let html = getForkHTML(JSON.parse(json));
*/


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
        settings.excludedExchanges.excludesIgnoreCase(fork.secondPair.exchange.title)
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
                    sessionStorage.setItem("pinnedForksIds","[]");

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


let numberOfPinnedPosts = 0;

console.log($('.thumbtack-icon'));
console.log('Количество незакрепленных иконок после загрузки: ' + $('.thumbtack-icon').length);
console.log('Количество закрепленных постов после загрузки: ' + $('.thumbtack-icon-active').length);
console.log('Переменная закрепленных постов после загрузки: ' + numberOfPinnedPosts);
console.log($('.thumbtack-icon-active'));

function pinFork()  {
    let fork = $(this).closest('.fork').clone();
    console.log('Индекс закрепляемого элемента: ' + $(this).closest('.fork').index());
    let indexOfFork = $(this).closest('.fork').index();
    if (indexOfFork === 0)  {
        $(this).closest('.fork').remove();
    } else  {
        $(this).closest('.fork').fadeOutAndRemove('fast');
    }
    console.log(fork);
    $(fork).find('.thumbtack-icon').removeClass('thumbtack-icon').addClass("thumbtack-icon-active");

    let pinnedForksIds = JSON.parse( sessionStorage.getItem('pinnedForksIds') ); //Получаем массив по ключу
    let id = $(this).closest('.fork').attr("fork-id");
    pinnedForksIds.unshift(id); //Добавляем id вилки
    sessionStorage.setItem( 'pinnedForksIds', JSON.stringify(pinnedForksIds) ); //Отправляем массив

    $(fork).find('.thumbtack-icon-active').click(unPinFork);
    numberOfPinnedPosts++;

    if (indexOfFork === 0)  {
        $(fork).prependTo("#container");
    } else  {
        $(fork).prependTo("#container").hide().fadeIn('fast');
    }

    console.log('Количество незакрепленных постов: ' + $('.thumbtack-icon').length);
    console.log('Количество закрепленных постов: ' + $('.thumbtack-icon-active').length);
    console.log('Переменная закрепленных постов: ' + numberOfPinnedPosts);
    console.log($('.thumbtack-icon.active'));

}

function unPinFork() {
    let fork = $(this).closest('.fork').clone();
    console.log('Индекс  открепляемого элемента: ' + $(this).closest('.fork').index());
    let indexOfFork = $(this).closest('.fork').index();

    if (indexOfFork === 0) {
        if (numberOfPinnedPosts === 1) {
            $(this).closest('.fork').remove();
        } else {
            $(this).closest('.fork').remove().fadeOutAndRemove('fast');
        }
    } else {
        if (numberOfPinnedPosts - 1 === indexOfFork)  {
            $(this).closest('.fork').remove();
        } else {
            $(this).closest('.fork').remove().fadeOutAndRemove('fast');
        }
    }

    console.log(fork);
    $(fork).find('.thumbtack-icon-active').removeClass("thumbtack-icon-active").addClass("thumbtack-icon");

    let pinnedForksIds = JSON.parse( sessionStorage.getItem('pinnedForksIds') ); //Получаем массив по ключу
    let id = $(this).closest('.fork').attr("fork-id");
    pinnedForksIds.splice( pinnedForksIds.indexOf(id), 1 ); //Начиная с позиции индекса идентификатора, удаляем один элемент
    sessionStorage.setItem( 'pinnedForksIds', JSON.stringify(pinnedForksIds) ); //Отправляем массив

    $(fork).find('.thumbtack-icon').click(pinFork);

    if (indexOfFork === 0)  {
        if (numberOfPinnedPosts === 1) {
            $(fork).prependTo("#container");
        } else {
            $(".fork:nth-child(" + (numberOfPinnedPosts - 1 )  + ")").after($(fork)).hide().fadeIn('fast');
            console.log($(".fork:nth-child(" + (numberOfPinnedPosts - 1)  + ")").find('.template-token-title'));
            let x = $(".fork:nth-child(" + (numberOfPinnedPosts - 1)  + ")").find('.template-token-title').text();
        }
    } else  {
        if (numberOfPinnedPosts - 1 === indexOfFork) {
            $(".fork:nth-child(" + (numberOfPinnedPosts - 1) + ")").after($(fork));
        }
        $(".fork:nth-child(" + (numberOfPinnedPosts - 1) + ")").after($(fork)).hide().fadeIn('fast');
    }

    numberOfPinnedPosts--;
    console.log('Количество незакрепленных постов' + $('.thumbtack-icon').length);
    console.log('Количество закрепленных постов' + $('.thumbtack-icon-active').length);
    console.log('Переменная закрепленных постов: ' + numberOfPinnedPosts);
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

    /*$(elem).attr('fork-id', id);*/
    $(elem).attr('fork-id', Math.floor(Math.random() * 1000000) + 1); //Рандомайзер идентификатора вилки
    $(elem).find('.fork-template__first-token-name a').text(minPair.exchange.title + ': ' + minPair.title);
    $(elem).find('.fork-template__first-token-name a').attr('href', minPair.url);

    $(elem).find('.fork-template__second-token-name a').text(maxPair.exchange.title + ': ' + maxPair.title);
    $(elem).find('.fork-template__second-token-name a').attr('href', maxPair.url);

    $(elem).find('.fork-template__first-volume').text('VOL: $' + minPair.volume24h.toLocaleString());
    $(elem).find('.fork-template__second-volume').text('VOL: $' + maxPair.volume24h.toLocaleString());
    $(elem).find('.fork-template__first-price').text('P: $' + minPair.price);
    $(elem).find('.fork-template__second-price').text('P: $' + maxPair.price);
    $(elem).find('.fork-template__sale-benefit').text(fork.profitPercent + '%');


    /*$(elem).find('.template__token-title').text(fork.token.title);//Добавляем названия биржи*/
    $(elem).find('.template__token-title').text(Math.floor(Math.random() * 1000) + 1);//Рандомайзер имени вилки
    $(elem).find('.template__token-symbol').text(fork.token.symbol); //Добвляем символьное представление биржи
    $(elem).find('.template__token-platform-title').text(fork.token.platform.title); //Добавляем заголовок платформы
    $(elem).find('.template__token-price').text(fork.token.quote.usdPrice.volume24h.toLocaleString());

    $(elem).find('.template__token-time').attr('value', getCurrentLifetimeString(fork.recieveDate));
    $(elem).find('.template__token-time').attr('receive-date', fork.recieveDate);

    $(elem).find('a.fork-link').attr('href', fork.url);
    $(elem).find('.remove-fork-btn').attr('onclick', "deleteFork(this)");
    $(elem).find('.hide-fork-btn').attr('onclick', "banPairs(this)");
    $(elem).find('.hide-fork-btn').attr('fork-pairs', minPair.title + ";" + maxPair.title);
    
    $(elem).find('.thumbtack-icon').click(pinFork);

    let countOfPinnedForks = $('.thumbtack-icon-active').length;
    let countOfUnPinnedForks = $('.thumbtack-icon').length;
    console.log('Количество закрепленных вилок: ' + countOfPinnedForks);
    console.log('Количество незакрепленных вилок: ' + countOfUnPinnedForks)
    if ( countOfPinnedForks === 0) {
        $('#container').prepend(elem);
    } else {
        $(".fork:nth-child(" + countOfPinnedForks  + ")").after(elem);
    }
}

