import 'dotenv/config';
import { AppDataSource } from '../src/utils/data-source';
import { User } from '../src/entities/User.entity';
import * as bcrypt from 'bcryptjs';

async function testPassword() {
  try {
    await AppDataSource.initialize();
    
    // Get the admin user
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email: 'admin@edtech.com' }
    });
    
    if (user) {
      console.log('Found user:', user.userName);
      console.log('Stored password hash:', user.password);
      
      // Test password comparison
      const testPassword = 'admin12345';
      const isMatch = await User.comparePasswords(testPassword, user.password);
      console.log('Password match:', isMatch);
      
      // Test direct bcrypt comparison
      const directMatch = await bcrypt.compare(testPassword, user.password);
      console.log('Direct bcrypt match:', directMatch);
      
      // Test with a new hash
      const newHash = await bcrypt.hash(testPassword, 12);
      console.log('New hash:', newHash);
      const newMatch = await bcrypt.compare(testPassword, newHash);
      console.log('New hash match:', newMatch);
    } else {
      console.log('User not found');
    }
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error:', error);
  }
}

testPassword();

