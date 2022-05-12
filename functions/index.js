const functions = require("firebase-functions");
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
var serviceAccount = require("./vecindiario-v2-firebase-adminsdk-nb5tw-044d3dffd5");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vecindiario-v2.firebaseio.com"
});

exports.notifyUser = functions.firestore
  .document('noticias/{noticiaId}')
  .onCreate(event => {

    const notificacion = event.data();
    const userId = notificacion.userId

    // Message details for end user
    const payload = {
      notification: {
        title: 'Tienes una nueva noticia!',
        body: `${notificacion.categoria} es la categoria de publicacion!`,
        icon: 'https://i.stack.imgur.com/34AD2.jpg',
        sound: 'default',
        badge: '1',
        click_action: "https://www.vecindiario.org/"
      }
    }

    // ref to the parent document
    const db = admin.firestore()
    const userRef = db.collection('users').doc(userId)


    // get users tokens and send notifications
    return userRef.get()
      .then(snapshot => snapshot.data())
      .then(user => {

        const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []

        if (!tokens.length) {
          throw new Error('El usuario no tiene tokens!')
        }

        return admin.messaging().sendToDevice(tokens, payload)
      })
      .catch(err => console.log(err))
  });