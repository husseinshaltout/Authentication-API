import { readFileSync } from 'fs';

import { User } from '@models/user.model';

class DataSeeder {
  // READ JSON FILE
  users = JSON.parse(
    readFileSync(`${__dirname}/../../data/users.json`, 'utf-8')
  );

  constructor() {}

  // IMPORT DATA INTO DB
  async importData() {
    try {
      await User.create(this.users);
    } catch (err) {
      console.log(`Import Error ${err}`);
    }
  }

  // DELETE ALL DATA FROM DB
  async deleteData() {
    try {
      await User.deleteMany();
    } catch (err) {
      console.log(`Delete Error: ${err}`);
    }
  }
}

const dataSeeder = new DataSeeder();
export default dataSeeder;
