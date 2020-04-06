const mongoose = require('mongoose');

const clearDb = async () => {
  for (const key in mongoose.connection.collections) {
    const collection = mongoose.connection.collections[key];
    await collection.deleteMany();
  }
};

const closeConnection = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongod = new MongoMemoryServer();
  await mongod.stop();
};

module.exports = {
  clearDb,
  closeConnection
};
