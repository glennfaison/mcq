const mongoose = require('mongoose');
require('dotenv').config();

let mongooseConnection;

/**
 *  Connect to MongoDB
 *  @returns {Promise<import('mongoose').Mongoose>}
 */
async function run () {
  if (mongooseConnection) { return mongooseConnection; }

  try {
    /** @type {import('mongoose').ConnectionOptions} */
    const mongooseOptions = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    };

    mongooseConnection = await mongoose.connect(process.env.MONGO_URI, mongooseOptions);

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
