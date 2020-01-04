var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BFGZcdNJUI2KKJTuLmEqWgwSrUX91HoKxcFZVNEhnh3Y-xpEukvc2ZE5MrSmMwJtRx2cAkkA3xKZHcZ3z2vP6Ng",
    "privateKey": "w0WV0yZyGLyNK38wVDhaI96Jt6wxbRUMxpWpPAofnjg"
};

webPush.setVapidDetails(
    'mailto:arifluthfi16@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

var endpoint = "https://fcm.googleapis.com/fcm/send/eukmZC3MG3Y:APA91bHGz10iGkdTvnVuJY8q_Np4asEEzzbt86t-HE_zTq7ktHmUhIR1GXzFFY0IxHt4A0J3KounRJx7dvnZMWe-drVG7jj1n5GaM39tGkMo1PzZ3RIWl7r6hRifiBJRk6jEAcnRKHSD"

var pushSubscription = {
    "endpoint": endpoint,
    "keys": {
        "p256dh": "BDEYAD1y+vJ5WuSxF8SIoYmBXa35QhurnU2FnOzmwQvzEyyYrS1St8OptKqIi8oZPZnifBzXb8ohUNrq3WZQuzQ=",
        "auth": "qHYw+c4EF6o3JMNZlA7Ttg=="
    }
};

var payload = 'Push Notif Submisi 3';

var options = {
    gcmAPIKey: '472809000726',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);