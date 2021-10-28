
let dbName = "store";
let storeName = "forks";
var database;

//let openRequest = indexedDB.open(dbName, 1);
function connectDB(f){
    var request = indexedDB.open(dbName, 1);
    request.onerror = function(err){
        console.log(err);
    };
    request.onsuccess = function(){
        // При успешном открытии вызвали коллбэк передав ему объект БД
        f(request.result);
    }
    request.onupgradeneeded = function(e){
        // Если БД еще не существует, то создаем хранилище объектов.
        e.currentTarget.result.createObjectStore(storeName, {});
        connectDB(f);
    }
}

connectDB((db) => {
    let init = Boolean(sessionStorage.getItem("init"));
    console.log("inited: " + init);

    initDb(init, db);
    database = db;
});
function initDb(init, db) {
    if(init === false) {
        clearDb(db, (r) => {
            $('#container').addClass("form loading");

            fetch(storeUrl + "forks")
                .then(response => response.json())
                .then(forks => {
                    console.log(forks);

                    forks.forEach(f => saveToDb(db, f));
                    sessionStorage.setItem("init", "true");

                    renderFilteredForks(forks);
                    $('#container').removeClass("form loading");
                    $('#container').transition("fade in");

                    console.log("init storage")
                });
            //.then(() => startSignalR());
        });
    } else {
        getAllFromDb(db, (forks) => {
            console.log(forks);

            renderFilteredForks(forks);

            console.log("retrieve storage");
            //startSignalR();
        });
    }
}

function clearDb(db, f) {
    let forksStore = db
        .transaction(storeName, "readwrite")
        .objectStore(storeName);

    let request = forksStore.clear();

    request.onsuccess = function() { // (4)
        f(request.result);
    };

    request.onerror = function() {
        console.log("db error: ", request.error);
    };
}

function saveToDb(db, fork) {
    let transaction = db.transaction(storeName, "readwrite"); // (1)

    // получить хранилище объектов для работы с ним
    let forksStore = transaction.objectStore(storeName);

    fork.id = generateUUID();
    let request = forksStore.put(fork, fork.id);

    request.onsuccess = function() { // (4)
        //console.log("db saved: ", request.result);
    };

    request.onerror = function() {
        console.log("db error: ", request.error);
    };
}
function getAllFromDb(db, func) {
    let transaction = db.transaction(storeName, "readonly"); // (1)

    // получить хранилище объектов для работы с ним
    let forksStore = transaction.objectStore(storeName);

    let request = forksStore.getAll();

    request.onsuccess = function() {
        func(request.result);
    };

    request.onerror = function() {
        console.log("db error: ", request.error);
    };
}
function removeFromDbByKey(db, forkKey) {
    let forksStore = db
        .transaction(storeName, "readwrite")
        .objectStore(storeName);

    let request = forksStore.delete(forkKey);

    request.onsuccess = function() {
        console.log("db remove: " + request.result);
    };

    request.onerror = function() {
        console.log("db error: ", request.error);
    };
}
