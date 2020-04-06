let _firebaseClient = require('firebase');
const mixin = require('../../helpers/mixin');

/**
 *  @type {{
 *    use: ({firebase}) => void
 *  } & import('firebase').auth.Auth}
 */
let client = {};

/**
 *  Inject dependencies into this service
 *  @param {{firebase:any}} { firebase }
 */
client.use = ({ firebase }) => {
  if (firebase) { _firebaseClient = firebase; }
};

client = mixin(_firebaseClient.auth(), client);

module.exports = client;
