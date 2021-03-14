let db;
const request = indexedDB.open("budget",1);


request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectSore("pending", {autoIncrement:True});
};
 
request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.online) {
        checkDatabase();
    }
};


requeest.onerror = function (event) {
    console.log(event.target.errorCode);
}
























//listen for app coming back online
window.addEventListener("online", checkDatabase);