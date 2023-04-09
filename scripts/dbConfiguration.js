require('dotenv').config()
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = JSON.parse(process.env.GGC);

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
});

const db = getFirestore();

module.exports = db;