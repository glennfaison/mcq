const firebaseAdmin = require('firebase-admin');
const { config } = require('dotenv');

config();

/**
 *  Initialize the firebase admin service
 *  @returns {import('firebase-admin').app.App}
 */
function run () {
  if (firebaseAdmin.apps.length) {
    return firebaseAdmin.apps[0];
  }
  if (process.env.NODE_ENV === 'testing') {
    return {
      auth: () => ({})
    };
  }

  let serviceAccount;
  try {
    serviceAccount = {
      type: process.env.FIREBASE_ADMIN_TYPE,
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
      token_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
    };
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  const app = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_ADMIN_PROJECT_ID}.firebaseio.com`
  });

  return app;
}

module.exports = run;
