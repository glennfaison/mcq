const setUpMongoose = require('./mongoose');
const setUpFirebaseAdmin = require('../../bootstrap/firebase-admin');
const setUpFirebaseClient = require('../../bootstrap/firebase-client');
const setUpMockFirebaseAdmin = require('./firebase-admin');
const setUpMockFirebaseClient = require('./firebase-client');

async function bootstrap () {
  await setUpMongoose();

  setUpFirebaseAdmin();
  setUpFirebaseClient();
  const Firebase = require('../../src/services/firebase');

  // Set up mock firebase apps
  const mockFirebaseAdmin = setUpMockFirebaseAdmin();
  const mockFirebaseClient = setUpMockFirebaseClient();
  try {
    // Inject mock dependencies into Firebase service
    Firebase.admin.use({ firebase: mockFirebaseAdmin.auth() });
    Firebase.client.use({ firebase: mockFirebaseClient.auth() });
  } catch (e) {
    /* Catch the "auth/invalid-api-key" error and do nothing about it. */
  }
}

module.exports = bootstrap;
