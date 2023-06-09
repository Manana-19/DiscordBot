// Importing firebase and firestore (and configuration of dotenv too coz it wasn't working)
require('dotenv').config();
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Importing Keys from .env then converting it into JSON then initializing the db
const serviceAccount = JSON.parse(process.env.GGC);
admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
});

// Configuring and Exporting the db
const db = getFirestore();
module.exports = db;