//const socketUrl = "https://coinswap-scanner.azurewebsites.net/ws/forks";
//const socketUrl = "https://localhost:5001/ws/forks";
//const socketUrl = "https://coinswapscanner.ngrok.io/ws/forks";

const socketUrl = "https://coinswap-scanner-store.herokuapp.com/";
//const socketUrl = "https://localhost:8082/";

// const hubConnection = new signalR.HubConnectionBuilder()
//     .withUrl(socketUrl, {
//         skipNegotiation: true,
//         transport: signalR.HttpTransportType.WebSockets
//     })
//     //.withAutomaticReconnect()
//     .build();
//
// hubConnection.on("Send", function (forkList) {
//     console.log(forkList);
//     saveForksInStorage(forkList.items);
//
//     let forks = forkList.items
//         .filter(f => isFilteredFork(f));
//     if(forks.length > 0){
//         $('#signal-lamp').transition('flash', '300ms');
//         renderFilteredForks(forks);
//         resetForksLifetimeInterval();
//
//         $('#container').transition('fade in', '300ms');
//     }
// });
//
// function startSignalR() {
//     try{
//         hubConnection.start();
//     } catch (error) {
//         console.log(error);
//         reconnect();
//     }
// }
// function reconnect(){
//     setTimeout(function () {
//         hubConnection.start();
//     }, 5000);
// }
// hubConnection.onclose(function() {
//     console.log('restart signalR connection');
//     reconnect();
// });

console.log("connecting to socket...");
stompClientNew = Stomp.over(
    new SockJS(socketUrl + "new"));
stompClientNew.debug = () => {};

var stompClientUpdate = Stomp.over(
    new SockJS(socketUrl + "update"));
stompClientUpdate.debug = () => {};

function startSignalR(){
    try{
        startSocket();
        startUpdatesSocket();
    }
    catch (e) {
        console.error(e);
        reconnect();
        reconnectUpdates();
    }
}
function reconnect(){
    setTimeout(function () {
            startSocket();
    }, 5000);
}
function reconnectUpdates(){
    setTimeout(function () {
        startUpdatesSocket();
    }, 5000);
}

function startSocket(){
    stompClientNew.connect({}, function (frame) {
        console.log("connected to: " + frame);

        stompClientNew.subscribe("/forks/new/", function (response) {
            let forkList = new Map(Object.entries(JSON.parse(response.body)));

            console.log(forkList);
            saveForksInStorage(forkList);

            let forks = Array.from(forkList.entries())
                .filter(pair => isFilteredFork(pair[1]));
            if(forks.length > 0){
                $('#signal-lamp').transition('flash', '300ms');
                renderFilteredForks(forks);
                resetForksLifetimeInterval();

                $('#container').transition('fade in', '300ms');
            }
        });
    });
}


function startUpdatesSocket() {
    stompClientUpdate.connect({}, function (frame) {
        console.log("connected to: " + frame);

        stompClientUpdate.subscribe("/forks/update/", function (response) {
            let updates = new Map(Object.entries(JSON.parse(response.body)));

            console.log('received ' + updates.size + " fork updates");

            Array.from(updates.entries()).forEach(pair => {
               let id = pair[0];
               let update = pair[1];
               if(forks.has(id)){
                   console.log("update fork from session");
                   console.log(update);
                   forks.set(id, update);
               }
               let forkElement = document.querySelector('[fork-id="'+id+'"]');
               if(forkElement != null){
                   //TODO RERENDER FORK UPDATE?
                   console.log("rerender fork element here");
               }
            });
            // saveForksInStorage(forkList.items);
            //
            // let forks = forkList.items
            //     .filter(f => isFilteredFork(f));
            // if(forks.length > 0){
            //     $('#signal-lamp').transition('flash', '300ms');
            //     renderFilteredForks(forks);
            //     resetForksLifetimeInterval();
            //
            //     $('#container').transition('fade in', '300ms');
            // }
        });
    });
}