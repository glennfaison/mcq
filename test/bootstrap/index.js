const setUpMongoose = require('./mongoose');
const { AuthService } = require('../../src/services');
const mockFirebaseAdminService = require('./firebase-admin');
const mockFirebaseClientService = require('./firebase-client');

async function bootstrap () {
  await setUpMongoose();
  AuthService.use({
    firebaseAdmin: mockFirebaseAdminService,
    firebaseClient: mockFirebaseClientService
  });
}

module.exports = bootstrap;
