const configureAndStartMongoose = require('./api/configuration/mongoose');
const seedRoles = require('./api/components/role/role.seeder');
const seedUsers = require('./api/components/user/user.seeder');
const createServer = require('./api/server');
require('dotenv').config();

async function init () {
  await configureAndStartMongoose();
  // run seeder functions
  await seedRoles();
  await seedUsers();

  const server = createServer();
  return server;
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
