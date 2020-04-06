const setUpMongoose = require('./mongoose');

async function bootstrap () {
  console.log('Connecting to MongoDB...');
  await setUpMongoose();
  console.log('Connected to MongoDB');
}

module.exports = bootstrap;
