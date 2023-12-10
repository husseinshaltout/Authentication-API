// Import Configurations
import config from '@config';

// Import Pre-Loaded Entry Application
import app from '@app/index';

// Import Main Server Loaders
import Server from '@loaders/server';
import MongoDbLoader from '@loaders/database';

// Create DB Loader Instance
const DBLoader = new MongoDbLoader(config.DATABASE);

// Create Server and Start Listening
const server = new Server(app, DBLoader);
server.start();

export default server;
