const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();
let mongooseConnection;

/**
 *  Connect to MongoDB
 *  @returns {Promise<import('mongoose').Mongoose>}
 */
async function run () {
  try {
    /** @type {import('mongoose').ConnectionOptions} */
    const mongooseOptions = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    };

    const mongoUri = await mongod.getConnectionString();
    mongooseConnection = await mongoose.connect(mongoUri, mongooseOptions);

    if (process.env.NODE_ENV === 'development') {
      mongooseConnection.set('debug', true);
    }

    return mongooseConnection;
  } catch (e) {
    console.log('Error while connecting to MongoDB');
    console.log(e);
    process.exit(-1);
  }
};

module.exports = run;
