let db:
const request = indexedDB.open("budget",1);


request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectSore("pending", {autoIncrement:True}});
};
 




}






















//listen for app coming back online
window.addEventListener("online", checkDatabase);