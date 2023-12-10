// Import Dependencies
import mongoose from 'mongoose';

interface Config {
  URI: string;
  PASSWORD: string;
}

// Class loads DB Config and had methods for connecting and disconnecting
export default class MongoDbLoader {
  connString: string;

  constructor(config: Config) {
    this.connString = config.URI.replace('<PASSWORD>', config.PASSWORD);
  }

  enableDebugging() {
    mongoose.set('debug', true);
    return this;
  }

  connect() {
    return mongoose.connect(this.connString);
  }

  closeConnection() {
    return mongoose.disconnect();
  }
}
