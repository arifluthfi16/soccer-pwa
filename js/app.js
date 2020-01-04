var appServerKey = urlBase64ToUint8Array("BFGZcdNJUI2KKJTuLmEqWgwSrUX91HoKxcFZVNEhnh3Y-xpEukvc2ZE5MrSmMwJtRx2cAkkA3xKZHcZ3z2vP6Ng");

if("serviceWorker" in navigator){
   window.addEventListener('load', function () {
       registerServiceWorker();
   })
}else{
    console.log("Service Worker tidak didukung browser ini");
}

// Check for notification API
if("Notification" in window){
    requestPermission();
}else{
    console.log("Browser tidak mendukung notification api");
}

function registerServiceWorker() {
    return navigator.serviceWorker.register('/service-worker.js')
        .then(function (regist) {
            console.log("Service worker berhasil didaftarkan ");
            return regist;
        })
        .catch(function (err) {
            console.log("Error : "+err);
        })
}

function requestPermission() {
    Notification.requestPermission().then(function (result) {
        if (result === "denied") {
            console.log("Fitur notifikasi tidak diijinkan");
            return;
        } else if (result === "default") {
            console.error("Pengguna menolak permintaan ijin");
            return;
        }
        console.log("Notification : " + result);
    })
}

if (('PushManager' in window)) {
    navigator.serviceWorker.getRegistration().then(function(registration) {
        registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: appServerKey
    }).then(function(subscribe) {
            console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
            console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                null, new Uint8Array(subscribe.getKey('p256dh')))));
            console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                null, new Uint8Array(subscribe.getKey('auth')))));
        }).catch(function(e) {
            console.error('Tidak dapat melakukan subscribe ', e.message);
        });
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

