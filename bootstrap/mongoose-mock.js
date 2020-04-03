const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

/**
 *  Connect to an in-memory version of MongoDB
 *  @returns {Promise<import('mongoose').Mongoose>}
 */
async function run () {
  const uri = await mongod.getConnectionString();

  /** @type {import('mongoose').ConnectionOptions} */
  const mongooseOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  };

  const connection = await mongoose.connect(uri, mongooseOptions);
  return connection;
}

/**
 *  Drop database, close the connection and stop mongod.
 *  @returns {Promise<void>}
 */
run.closeMongoDbDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 *  Remove all the data for all db collections.
 *  @returns {Promise<void>}
 */
run.clearMongoDbDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

module.exports = run;
