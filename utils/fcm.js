const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

exports.sendPush = (token, title, body) => {
   admin.messaging().send({token, notification:{title, body}})
   .catch(err => console.log('FCM error', err));
}