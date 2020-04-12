const mixin = require('../../helpers/mixin');
const setUp = require('../../configuration/firebase-client');

let _firebaseClient = setUp();

class _FirebaseClientService {
  /**
   *  Inject dependencies into this service
   *  @param {{firebase:any}} { firebase }
   */
  use ({ firebase }) {
    if (firebase) { _firebaseClient = firebase; }
  }
}

/** @typedef {_FirebaseClientService & import('firebase').auth.Auth} FirebaseClientService */

/** @type {FirebaseClientService} */
const client = mixin(_firebaseClient.auth(), new _FirebaseClientService());

module.exports = client;
