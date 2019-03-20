import firebase from 'firebase';
import Firestore from 'firebase/firestore';
import Storage from 'firebase/storage';

import {
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID
} from 'react-native-dotenv';

const config = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID
};

firebase.initializeApp(config);

var db = firebase.firestore();
var storage = firebase.storage();

exports.firebase = firebase;
exports.db = db;
exports.storage = storage;