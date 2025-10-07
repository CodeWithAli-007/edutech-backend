
import { createClient } from 'redis';

const redisUrl = 'redis://127.0.0.1:6379';

const redisClient = createClient(
  {
    url: redisUrl,
  }
);

const connectRedis = async () => {
  try {
    redisClient.on('error', err => console.log('Redis Client Error', err));
    await redisClient.connect();
    console.log('Redis client connect successfully');
    redisClient.set('try', 'Hello Welcome to Express with TypeORM');
  } catch (error) {
    console.log(error);
    //setTimeout(connectRedis, 5000);
    await redisClient.disconnect();
  }
};

connectRedis();

export default redisClient;
