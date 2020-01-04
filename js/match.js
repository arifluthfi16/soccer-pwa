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
}

const loadMatchData= async () => {
        var teamId = getUrlParam('id',null);

         const res = await fetch(base_url+`teams/${teamId}/matches/`,{headers});
         const stat = await status(res);
         const json = await stat.json();

         json.matches.forEach(function (element) {
             construct(element).then(function (data) {
                 attachComponent(data).then(function (data) {
                     console.log(data);
                 })
             })
         })
}

function getDate(utcDate) {
    var date = new Date(utcDate);
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return date.toLocaleDateString('id', options);
}

function getTime(utcDate){
    var date = new Date(utcDate);
    var timeOpt = {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h24',
        timeZone : 'Asia/Jakarta'
    }

    return date.toLocaleDateString('id', timeOpt);
}

async function construct(match) {
    try {
        // Need Error Handling
        const awayTeam = await fetch(base_url + "teams/" + match.awayTeam.id, {headers});;
        const homeTeam = await fetch(base_url + "teams/" + match.homeTeam.id, {headers});
        const awayTeamData = await awayTeam.json();
        const homeTeamData = await homeTeam.json();

        // Get Date
        var matchDate = getDate(match.utcDate);

        //Construct
        var Element = `
            <div class="table-outline margin-top">
            <table class="centered no-border">
                <thead>
                    <tr>
                        <th class="match-border-bottom" colspan="3">${match.competition.name}</th>
                    </tr>
                </thead>

                <tbody>
                <tr>
                    <td class="padding-top">${awayTeamData.name}</td>
                    <td></td>
                    <td class="padding-top">${homeTeamData.name}</td>
                </tr>
                <tr>
                </tr>
                <tr>
                    <td><img class="image-match center-vert" src="${awayTeamData.crestUrl ? awayTeamData.crestUrl.replace(/^http:\/\//i, 'https://') : '/img/nullcrest.png'}" alt=""></td>
                    <td><h1 class="center-vert resp-font">VS</h1></td>
                    <td><img class="image-match center-vert" src="${homeTeamData.crestUrl ? homeTeamData.crestUrl.replace(/^http:\/\//i, 'https://') : '/img/nullcrest.png'}" alt=""></td>
                </tr>
                <tr>
                    <td class="match-border-top shade padding-updown"><strong>Match Day</strong></td>
                    <td class="match-border-top shade-2" colspan="2">${matchDate}</td>
                </tr>

                </tbody>
            </table>
        </div>
        `;
        return createElementFromHTML(Element);
    }catch (e) {
        return;
    }
}

function attachComponent(component) {
    return new Promise(function (resolve, reject) {
        var target = document.getElementById('matchBody');
        if(target.append(component)){
            resolve(true);
        }else{
            reject(false);
        }
    })
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
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
