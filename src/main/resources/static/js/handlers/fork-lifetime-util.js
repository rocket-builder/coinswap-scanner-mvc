function forkLifetimeTimerInit(fork) {
    let receiveDate = new Date(fork.recieveDate);
    //console.log(receiveDate);

    let lifetime = getCurrentLifetimeString(receiveDate);
    $('[fork-id='+fork.id+'] > input.fork-lifetime').val(lifetime);
}

function getCurrentLifetimeString(receiveDate) {
    let currentLifetime = new Date() - receiveDate;

    return getTimeString(currentLifetime);
}

function getTimeString(currentLifetime) {
    const hours = currentLifetime > 0 ? Math.floor(currentLifetime / 1000 / 60 / 60) % 24 : 0;
    const minutes = currentLifetime > 0 ? Math.floor(currentLifetime / 1000 / 60) % 60 : 0;
    const seconds = currentLifetime > 0 ? Math.floor(currentLifetime / 1000) % 60 : 0;

    let hoursString = hours < 10 ? '0' + hours : hours;
    let minutesString = minutes < 10 ? '0' + minutes : minutes;
    let secondsString = seconds < 10 ? '0' + seconds : seconds;

    return hoursString + ':' + minutesString + ':' + secondsString;
}
function resetForksLifetime(){
    $('.fork-lifetime').each(function () {
        let dateString = $(this).attr('receive-date').toString();
        let receiveDate = new Date(dateString);

        let lifetimeString = getCurrentLifetimeString(receiveDate);
        $(this).val(lifetimeString);
    });
}

function resetForksLifetimeInterval(){
    window.setInterval(resetForksLifetime, 1000);
}