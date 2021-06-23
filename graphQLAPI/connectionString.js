const dbName = process.env.MONGODB_DB_NAME || 'guesstimoji';
const hostName = process.env.MONGODB_HOST_NAME || 'mongo';
const connectionString = 'mongodb://' + hostName + '/' + dbName;

module.exports = {
    connectionString,
};
