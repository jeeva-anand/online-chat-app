import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA_u9_2C_PrOy6wTfEfqtNSxshzrCKbOTQ",
    authDomain: "chat-app-c8c26.firebaseapp.com",
    databaseURL: "https://chat-app-c8c26-default-rtdb.firebaseio.com",
    projectId: "chat-app-c8c26",
    storageBucket: "chat-app-c8c26.appspot.com",
    messagingSenderId: "537921687659",
    appId: "1:537921687659:web:f418444f65e78c4cd7612e"
})

const db = firebaseApp.firestore()

export default db