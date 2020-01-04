const idbPromise = idb.open("football-db",1, function (upgradeDb) {
    console.log("Connection Established")
    if(!upgradeDb.objectStoreNames.contains("favorite_team")){
        upgradeDb.createObjectStore("favorite_team", {keyPath:"id"});
    }
})
