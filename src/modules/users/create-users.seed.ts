import { Seeder, Factory } from 'typeorm-seeding';
import { UserEntity } from './user.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(UserEntity)().create();
  }
}
