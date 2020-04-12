const { MongoMemoryServer } = require('mongodb-memory-server');
const setUpAndStartMongoose = require('./mongoose');

const mongod = new MongoMemoryServer();

/**
 *  Connect to MongoDB
 *  @returns {Promise<import('mongoose').Mongoose>}
 */
async function run () {
  try {
    const mongoUri = await mongod.getConnectionString();

    return await setUpAndStartMongoose(mongoUri, true);
  } catch (e) {
    console.log('Error while connecting to MongoDB');
    console.log(e);
    process.exit(-1);
  }
};

module.exports = run;
