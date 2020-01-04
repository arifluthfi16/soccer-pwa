var base_url = "https://api.football-data.org/v2/";
var headers = {
    "X-Auth-Token"  : "e757c56ccfb54a5c83b8f5cbf32c30f7",
}

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
    console.log("Base URL : "+base_url)
}

function loadTeam() {
    fetch(base_url+"teams",{headers})
        .then(status)
        .then(json)
        .then(function (data) {
            var contentHTML = "";
            for(var i = 0 ; i<data.teams.length;i++){
                contentHTML += `
                    <div class="col s12 m4">
                      <div class="card large">
                        <div class="card-image">
                            <img class="image-banner" src="${data.teams[i].crestUrl}" onerror="this.onerror=null; this.src='/img/nullcrest.png'">
                        </div>
                        <div class="card-content">
                            <span class="card-title">${data.teams[i].name}</span>
                        </div>
                        <div class="card-action">
                          <a href="/pages/teamDetail.html?id=${data.teams[i].id}">Team Detail</a>
                        </div>
                      </div>
                    </div>
            `
            }
            document.getElementById("contentBody").innerHTML = contentHTML;
        })
        .catch(error)
}

function loadTeamDetail() {
    var teamId = getUrlParam("id", null);
    var urls = base_url+"teams/"+teamId;
    fetch(urls, {headers})
        .then(status)
        .then(json)
        .then(function (data) {
            var contentHTML = `
                <div class="col s12 m12">
                  <div class="card white darken-1">
                    <div class="card-content">
                        <span class="card-title">
                            <img class="image-banner" src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="">
                        </span>
                        <table class="centered">
                               <tr>
                                    <td>Team Name</td>
                                    <td>${data.name}</td>
                               </tr>         
                               <tr>
                                    <td>Address</td>
                                    <td>${data.address}</td>
                               </tr>      
                               <tr>
                                    <td>Website</td>
                                    <td>${data.website}</td>
                               </tr>            
                        </table>
                         <button class="btn waves-effect waves-light margin-top" type="submit" onclick="addFavorite('${data.id}','${data.name}','${data.crestUrl}')" id="btnAddFav">Add to Favorite
                            <i class="material-icons left">star</i>
                          </button>
                          <a href="/pages/match.html?id=${data.id}" class="btn waves-effect waves-light margin-top">Match History</a>
                    </div>
                  </div>
                </div>
                
                <div class="col s12 m12">
                  <div class="card white darken-1">
                    <div class="card-content">
                        <table class="centered">
                               <thead>
                                    <th colspan="2" class="shade">Players</th>
                               </thead> 
                               <tr>
                                    <td class="shade">Name</td>
                                    <td class="shade">Position</td>
                               </tr> 
                              
            `;
            data.squad.forEach(function (elem) {
                contentHTML += `
                               <tr>
                                    <td>${elem.name}</td>
                                    <td>${elem.position ? elem.position : "-"}</td>
                               </tr>         
                               `
            })

            contentHTML += `</table>
                    </div>
                  </div>
                </div>`
            document.getElementById("contentBody").innerHTML = contentHTML;
            return data;
        }).then(data=>{
            isFavorite(data.id).then(res=>{
                // Jika dalam favorite disable button nya
                if(res){
                    changeButton();
                }
            })
        })
        .catch(error);
}

function loadFavoriteTeam() {
    getAllFavorite().then(elem=>{

        var contentHtml = `<table class="centered">
        <thead>
          <tr>
              <th>Id</th>
              <th>Crest</th>
              <th>Team Name</th>
              <th colspan="2">Action</th>
          </tr>
        </thead>
        <tbody>
         `

        elem.forEach(function (res) {
            contentHtml += `
                  <tr>
                    <td>${res.id}</td>
                    <td><img class="image-fav" src="${res.imgUrl}" alt=""></td>
                    <td>${res.name}</td>
                    <td>
                        <button class="btn waves-effect waves-light red" onclick="deleteFavorite(${res.id})">
                            <span class="hide-on-small-and-down">Delete
                            <i class="material-icons right">delete</i>
                            </span >
                            <i class="material-icons hide-on-med-and-up">delete</i>
                        </button>
                        <a href="/pages/teamDetail.html?id=${res.id}" class="btn waves-effect waves-light blue">
                            <span class="hide-on-small-and-down">Team Detail
                            <i class="material-icons right">info</i>
                            </span >
                            <i class="material-icons hide-on-med-and-up">info</i>
                        </a>
                    </td>
                  </tr>
            `
        })
        contentHtml += `
                    </tbody>
                  </table>`
        let target =document.getElementById("contentBody");
        target.innerHTML = contentHtml;
    })
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


// Index DB Stuff
function addFavorite(teamId,name,img) {
    var imgUrl = img.replace(/^http:\/\//i, 'https://')

    const teamObj = {
        id : teamId,
        name,
        imgUrl
    }
    idbPromise.then(function (db) {
        const tx = db.transaction("favorite_team","readwrite");
        tx.objectStore("favorite_team").add(teamObj);
        return tx;
    }).then(tx => {
        if(tx.complete){
            console.log("Done")
            changeButton();
        }else{
            console.log(new Error(tx.onerror));
        }
    })
}

function changeButton() {
    var target = document.getElementById("btnAddFav");
    target.classList.add("pink");
    target.setAttribute("disabled",true);
    var favButton = `
        Added to Favorites
        <i class="material-icons left">favorite</i>
    `;
    target.innerHTML = favButton;
}

function isFavorite(teamId) {
    return new Promise((resolve, reject) => {
        idbPromise.then(function (db) {
            var tx = db.transaction('favorite_team', 'readonly');
            var store = tx.objectStore('favorite_team');
            return store.get(teamId.toString());
        }).then(val =>{
            if(val.id == teamId){
                resolve(true);
            }else{
                resolve(false);
            }
        }).catch(error);
    })
}

function getAllFavorite() {
    return new Promise((resolve, reject) => {
        idbPromise.then(function (db) {
            var tx = db.transaction('favorite_team', 'readonly');
            var store = tx.objectStore('favorite_team');
            return store.getAll();
        }).then(val =>{
            if(val){
                resolve(val);
            }else{
                resolve(null);
            }
        }).catch(error);
    })
}

function deleteFavorite(teamId) {
    var id = teamId.toString();
    return new Promise((resolve, reject) => {
        console.log("Delete Called");
        idbPromise.then(function (db) {
            var tx = db.transaction('favorite_team', 'readwrite');
            var store = tx.objectStore('favorite_team');
            return store.delete(id);
        }).then(val =>{
            window.location.reload();
            resolve(true);
        }).catch(error);
    })
}

