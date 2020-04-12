const setUpAndStartMongoose = require('../configuration/mongoose-mock');
const AuthService = require('../components/auth/auth.service');
const mockFirebaseAdminService = require('../mocks/firebase-admin.service');
const mockFirebaseClientService = require('../mocks/firebase-client.service');

async function bootstrap () {
  await setUpAndStartMongoose();
  AuthService.use({
    firebaseAdmin: mockFirebaseAdminService,
    firebaseClient: mockFirebaseClientService
  });
}

module.exports = bootstrap;
