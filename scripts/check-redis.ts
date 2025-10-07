import 'dotenv/config';
import redisClient from '../src/utils/connectRedis';

async function checkRedis() {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
    
    const keys = await redisClient.keys('*');
    console.log('Redis keys:', keys);
    
    if (keys.length > 0) {
      for (const key of keys) {
        const session = await redisClient.get(key);
        console.log(`Session for ${key}:`, session);
      }
    } else {
      console.log('No sessions found in Redis');
    }
    
    await redisClient.disconnect();
  } catch (error) {
    console.error('Redis error:', error);
  }
}

checkRedis();

