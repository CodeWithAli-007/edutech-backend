import 'dotenv/config';
import { AppDataSource } from '../src/utils/data-source';
import { User } from '../src/entities/User.entity';

async function checkUsers() {
  try {
    await AppDataSource.initialize();
    const users = await AppDataSource.getRepository(User).find();
    console.log('Users in database:');
    users.forEach(u => console.log(`- ${u.userName} (${u.email}) - Role: ${u.role}`));
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();

