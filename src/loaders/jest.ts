import dataSeeder from '@common/util/data-seeder';
import server from '../server';

beforeEach(async () => {
  await dataSeeder.deleteData();
  await dataSeeder.importData();
}, 300000);

afterAll(async () => {
  server.stop();
});
