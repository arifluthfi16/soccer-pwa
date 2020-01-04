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

var endpoint = "https://fcm.googleapis.com/fcm/send/c8maQYwmvdw:APA91bFlW-4d1guL7cTzV2bS8mSMQC_8rjaYA0Qj_XhsxyT3Oy3JfTsq0C0Q1ti5VodEHOzbKg48lL5DFC24hpXfZjXKmebb2nPC_RmZQjMBlbhCwNKFrP-zg3hcxmsaopRK3D4_verF"

var pushSubscription = {
    "endpoint": endpoint,
    "keys": {
        "p256dh": "BL7ckGacEFVcvcpRnKWI29uQr1kRpqX+721qFoFNkneDmLXnRZJcZqO7bt+18d74w2V+UtXieKHq1I5aq7X10CQ=",
        "auth": "tRYv3qHuFIjp77P0Rh5Wbg=="
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