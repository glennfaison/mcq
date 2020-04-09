class FirebaseDb {}

FirebaseDb.makeId = (length) => {
  const characters = '0123456789abcdef';
  const result = new Array(length)
    .fill('')
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('');
  return result;
};

FirebaseDb.clearDb = () => {
  FirebaseDb.db = {};
  FirebaseDb.idTokens = {};
};

FirebaseDb.db = {};
FirebaseDb.idTokens = {};

module.exports = FirebaseDb;
