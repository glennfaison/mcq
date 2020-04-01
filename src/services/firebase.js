const firebaseAdmin = require('firebase-admin');
const firebase = require('firebase');

const service = {};
service.admin = firebaseAdmin.auth();
service.client = firebase.auth();

module.exports = service;
