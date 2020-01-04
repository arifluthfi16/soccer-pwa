// Import Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

// Prepare asset for cache
var CACHE_NAME = "submisi-v16";

workbox.precaching.precacheAndRoute([
    {url:"/", revision:'1'},
    {url:"/index.html", revision:'2'},
    {url:"/manifest.json", revision:'1'},
    {url:"/js/app.js", revision:'1'},
    {url:"/service-worker.js", revision:'1'},
    {url:"/js/team.js", revision:'1'},
    {url:"/js/idb.js", revision:'1'},
    {url:"/js/idb-controller.js", revision:'1'},
    {url:"/css/style.css", revision:'1'},
    {url:"/css/materialize.min.css", revision:'1'},
    {url:"/js/materialize.min.js", revision:'1'},
    {url:"https://fonts.googleapis.com/icon?family=Material+Icons", revision:'1'},
    {url:"/img/ball.png", revision:'1'},
    {url:"/img/nullcrest.png", revision:'1'},
]);

workbox.routing.registerRoute(
    new RegExp('public/pages/'),
    workbox.strategies.cacheFirst({
        cacheName : 'pages'
    })
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg|css|js)$/,
    workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
    /^https:\/\/api\.football-data\.org\/v2/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'api',
    })
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'fonts',
    })
);

self.addEventListener('push', function (event) {
    console.log("Push notif called");
    var body;
    if(event.data){
        body = event.data.text()
    }else{
        body = 'Push message no payload';
    }
    var options = {
        body,
        vibrate : [100,50,100],
        data: {
            dateOfArrival : Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Push Notif', options)
    )
})
