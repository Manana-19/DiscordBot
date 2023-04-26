// Importing firebase and firestore (and configuration of dotenv too coz it wasn't working)
require('dotenv').config();
const {initializeApp, cert} = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Importing Keys from .env then converting it into JSON then initializing the db
const serviceAccount = JSON.parse(process.env.GGC);
initializeApp({
    credential:cert(serviceAccount)
});

// Configuring and Exporting the db
const db = getFirestore();
module.exports = db;