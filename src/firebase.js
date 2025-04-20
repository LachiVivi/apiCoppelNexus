require('dotenv').config()

const { initializeApp,applicationDefault } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp({
    credentials: applicationDefault()
});

const db = getFirestore();

module.exports = {
    db,
}