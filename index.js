const setUpMongoose = require('./bootstrap/mongoose');
const createServer = require('./src/server');
const seeders = require('./src/seeders');
require('dotenv').config();

async function init () {
  await setUpMongoose();
  // run seeder functions
  await seeders.roles();
  await seeders.users();

  return createServer();
}

init().then(server => {
  // Start the server
  server.listen(process.env.PORT, async () => {
    console.log(`Listening at http://localhost:${process.env.PORT} in ${process.env.NODE_ENV} mode`);
  });
});

if (process.env.NODE_ENV === 'production') {
  // Catch any uncaught exceptions in this application
  process.on('uncaughtException', (err) => {
    console.log(`There was an uncaught exception: ${err}`);
  });

  // Catch any unhandled rejections in this application
  process.on('unhandledRejection', (err) => {
    console.log(`There was an unhandled rejection: ${err}`);
  });
}
