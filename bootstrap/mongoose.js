const mongoose = require('mongoose');

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

    const connection = await mongoose
      .connect(process.env.MONGO_URI, mongooseOptions);
    return connection;
  } catch (e) {
    console.log('Error while connecting to MongoDB');
    console.log(e);
    process.exit(-1);
  }
}

module.exports = run;
