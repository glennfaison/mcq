const crypto = require('crypto');

class FirebaseDb {}

FirebaseDb.makeId = (length) => {
  return crypto.randomBytes(24).toString('hex').substring(0, length);
};

FirebaseDb.clearDb = () => {
  FirebaseDb.db = {};
  FirebaseDb.idTokens = {};
};

FirebaseDb.db = {};
FirebaseDb.idTokens = {};

module.exports = FirebaseDb;
