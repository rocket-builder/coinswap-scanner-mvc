// let openRequest = indexedDB.open("store", 1);
//
// // var init = Boolean(sessionStorage.getItem("init"));
// // if(init === false){
// //
// // }
// //db.deleteObjectStore('books');
//
// // создаём хранилище объектов для books, если ешё не существует
// openRequest.onupgradeneeded = function() {
//     let db = openRequest.result;
//     if (!db.objectStoreNames.contains('forks')) { // если хранилище "books" не существует
//         db.createObjectStore('forks', {keyPath: 'id'}); // создаем хранилище
//     }
// };
//
// openRequest.onerror = function (error) {
//     console.log(error);
// };
//
// openRequest.onsuccess = function() {
//     let db = openRequest.result;
//
//     db.onversionchange = function() {
//         db.close();
//         location.reload();
//     };
//
//     // ...база данных доступна как объект db...
// };
//
// openRequest.onblocked = function() {
//     // есть другое соединение к той же базе
//     // и оно не было закрыто после срабатывания на нём db.onversionchange
// };