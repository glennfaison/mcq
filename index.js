// Load data from a .env file into process.env if available
require('dotenv').config();

const createServer = require('./src/server');
const bootstrap = require('./bootstrap');

async function run () {
  await bootstrap();
  const server = createServer();
  // Start the server
  server.listen(process.env.PORT, async () => {
    console.log(`Listening at http://localhost:${process.env.PORT} in ${process.env.NODE_ENV} mode`);
  });
}

run();

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
