import 'dotenv/config';
import redisClient from '../src/utils/connectRedis';
import { AppDataSource } from '../src/utils/data-source';
import { User } from '../src/entities/User.entity';

const userId = 'dd6fa1f9-9648-400e-af73-3c128e5799c2';

async function checkUserSession() {
  try {
    await AppDataSource.initialize();
    
    // Check if user exists in database
    const user = await AppDataSource.getRepository(User).findOne({
      where: { user_id: userId }
    });
    
    if (user) {
      console.log('User found in database:', user.userName, user.email);
    } else {
      console.log('User not found in database');
    }
    
    // Check Redis session
    const session = await redisClient.get(userId);
    if (session) {
      console.log('Session found in Redis:', session);
      const sessionData = JSON.parse(session);
      console.log('Parsed session data:', sessionData);
    } else {
      console.log('No session found in Redis for user:', userId);
    }
    
    // List all Redis keys
    const keys = await redisClient.keys('*');
    console.log('All Redis keys:', keys);
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUserSession();


