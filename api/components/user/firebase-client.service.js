const mixin = require('../../helpers/mixin');
const setUp = require('../../configuration/firebase-client');

let _firebaseClient = setUp();

class Service {
  /**
   *  Inject dependencies into this service
   *  @param {{firebase:any}} { firebase }
   */
  use ({ firebase }) {
    if (firebase) { _firebaseClient = firebase; }
  }
}

/** @typedef {Service & import('firebase').auth.Auth} FirebaseClientService */

/** @type {FirebaseClientService} */
const client = mixin(_firebaseClient.auth(), new Service());

module.exports = client;
