importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '439570071836'
});

const messaging = firebase.messaging();

