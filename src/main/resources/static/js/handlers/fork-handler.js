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
                    refreshPaginator(filterForks(Array.from(storageForks.entries())).length);

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
                    refreshPaginator(filterForks(Array.from(allForks.entries())).length);
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
function paginate(element, page) {
    let filtered = filterForks(Array.from(allForks.entries()));
    let ranged = filtered.range(page * maxForkCount, (page * maxForkCount + maxForkCount) - 1);
    $('#container').html('');
    renderForks(ranged);
    $('.fork-page').removeClass('active');
    $(element).addClass('active');
}
function refreshPaginator(forksCount) {
    console.log('refresh paginator');
    let pageCount = forksCount / maxForkCount;
    console.log(pageCount);

    for(let i = 1; i < pageCount;i++){
        $('#fork-paginator').append('<span class="fork-page" onclick="paginate(this, '+i+')">'+i+'</span>');
    }
}

function filterForks(forks) {
    return forks
        .filter(pair => isFilteredFork(pair[1]));
}
function renderForks(forks) {
    forks.sort((a,b) =>
        new Date(b[1].recieveDate) - new Date(a[1].recieveDate));

    if(forks.length > 0){
        let forksDivs = Array.from(document.querySelectorAll('[fork-id]'));
        forksDivs
            .slice(Math.abs(forksDivs.length - forks.length))
            .forEach(f => f.remove())
        let html = forks.map(pair => getForkHTML(pair)).join("");
    }
}
function renderFilteredForks(forks) {
    console.log(forks);

    let filtered = filterForks(forks)
        .slice(0, maxForkCount);
    renderForks(filtered);
}

function refreshForksFromSettings() {
    document.querySelector("#container").innerHTML = "";
    let filtered =
        Array.from(forks.concat(cachedForks).entries())
            .filter(pair => isFilteredFork(pair[1]))
            .slice(0, maxForkCount);
    filtered.sort((a,b) =>
        new Date(b[1].recieveDate) - new Date(a[1].recieveDate));

    console.log("filtered in refresh function" + filtered);
    let html = filtered.map(pair => getForkHTML(pair)).join("");
    resetForksLifetimeInterval();
}

let numberOfPinnedPosts = 0;

function pinFork()  {
    let fork = $(this).closest('.fork').clone();
    let indexOfFork = $(this).closest('.fork').index();
    if (indexOfFork === 0)  {
        $(this).closest('.fork').remove();
    } else  {
        $(this).closest('.fork').fadeOutAndRemove('fast');
    }
    $(fork).find('.thumbtack-icon').removeClass('thumbtack-icon').addClass("thumbtack-icon-active");

    let pinnedForksIds = JSON.parse( sessionStorage.getItem('pinnedForksIds') );
    let id = $(this).closest('.fork').attr("fork-id");
    pinnedForksIds.unshift(id);
    sessionStorage.setItem( 'pinnedForksIds', JSON.stringify(pinnedForksIds) );

    $(fork).find('.thumbtack-icon-active').click(unpinFork);
    numberOfPinnedPosts++;

    if (indexOfFork === 0)  {
        $(fork).prependTo("#container");
    } else  {
        $(fork).prependTo("#container").hide().fadeIn('fast');
    }
}

function unpinFork() {
    let fork = $(this).closest('.fork').clone();
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
    $(fork).find('.thumbtack-icon-active').removeClass("thumbtack-icon-active").addClass("thumbtack-icon");

    let pinnedForksIds = JSON.parse( sessionStorage.getItem('pinnedForksIds') );
    let id = $(this).closest('.fork').attr("fork-id");
    pinnedForksIds.splice( pinnedForksIds.indexOf(id), 1 );
    sessionStorage.setItem( 'pinnedForksIds', JSON.stringify(pinnedForksIds) );

    $(fork).find('.thumbtack-icon').click(pinFork);

    if (indexOfFork === 0)  {
        if (numberOfPinnedPosts === 1) {
            $(fork).prependTo("#container");
        } else {
            $(".fork:nth-child(" + (numberOfPinnedPosts - 1 )  + ")").after($(fork)).hide().fadeIn('fast');
        }
    } else  {
        if (numberOfPinnedPosts - 1 === indexOfFork) {
            $(".fork:nth-child(" + (numberOfPinnedPosts - 1) + ")").after($(fork));
        }
        $(".fork:nth-child(" + (numberOfPinnedPosts - 1) + ")").after($(fork)).hide().fadeIn('fast');
    }

    numberOfPinnedPosts--;
}

function getForkHTML(pair) {
    let id = pair[0];
    let fork = pair[1];
    let percent = Number(fork.profitPercent);
    //let color = getColorByProfit(percent);

    let elem = document.createElement('div');
    elem.classList.add("fork");
    elem.classList.add("forked");
    elem.append(tmpl.content.cloneNode(true));

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


    $(elem).find('.template__token-title').text(fork.token.title);
    $(elem).find('.template__token-symbol').text(fork.token.symbol);
    $(elem).find('.template__token-platform-title').text(fork.token.platform.title);
    $(elem).find('.template__token-price').text(fork.token.quote.usdPrice.volume24h.toLocaleString());

    $(elem).find('.template__token-time').attr('value', getCurrentLifetimeString(fork.recieveDate));
    $(elem).find('.template__token-time').attr('receive-date', fork.recieveDate);

    $(elem).find('a.fork-link').attr('href', fork.url);
    $(elem).find('.remove-fork-btn').attr('onclick', "deleteFork(this)");
    $(elem).find('.hide-fork-btn').attr('onclick', "banPairs(this)");
    $(elem).find('.hide-fork-btn').attr('fork-pairs', minPair.title + ";" + maxPair.title);


    if (sessionStorage.getItem("pinnedForksIds") !== null)  {
        let pinnedForksArray = JSON.parse( sessionStorage.getItem('pinnedForksIds') );
        if (pinnedForksArray.includes($(elem).attr('fork-id')) == true )   {
            $(elem).find('.thumbtack-icon').removeClass('thumbtack-icon').addClass("thumbtack-icon-active");
            $(elem).find('.thumbtack-icon-active').click(unpinFork);
            $('#container').prepend(elem);
        } else  {
            $(elem).find('.thumbtack-icon').click(pinFork);
            let countOfPinnedForks = $('.thumbtack-icon-active').length;
            if ( countOfPinnedForks === 0) {
                $('#container').prepend(elem);
            } else {
                $(".fork:nth-child(" + countOfPinnedForks  + ")").after(elem);
            }
        }

    }
}

