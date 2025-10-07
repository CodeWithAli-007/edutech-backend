
import { Request } from 'express';
import { User } from '../entities/User.entity';
import { AppDataSource } from '../utils/data-source';
import { Institute } from '../entities/institute.entity';
import { createUser, findUserByEmail } from './user.service';

const instituteRepository = AppDataSource.getRepository(Institute);

export const createInstitute = async (input: Partial<Institute>, user: User) => {
  // Check if email already exists
  if (input.email) {
    const existingUser = await findUserByEmail({ email: input.email });
    if (existingUser) {
      throw new Error('Email already exists');
    }
  }

  // Generate UUID if not provided
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const instituteId = input.institute_id || generateUUID();

  // First create the institute
  const institute = await instituteRepository.save(instituteRepository.create({ ...input, institute_id: instituteId, updatedBy: user.user_id }));

  // Then create a User for the institute if email and password are provided
  if (input.email && (input as any).password) {
    const instituteUser = await createUser({
      user_id: instituteId,
      userName: `${input.name?.toLowerCase().replace(/\s+/g, '_') || 'institute'}_${Math.random().toString(36).substring(2, 8)}`,
      email: input.email,
      password: (input as any).password || 'institute12345',
      role: 'institute_admin',
      status: 'active',
      verified: true,
      verificationCode: 'verified',
      instituteId: instituteId, // Set the instituteId for the institute admin user
    });
  }

  return institute;
};

export const getInstitute = async (instituteId: string) => {
  return await instituteRepository.findOneBy({ institute_id: instituteId });
};

export const findInstitutes = async (req: Request) => {

   const builder = instituteRepository.createQueryBuilder('institute');

   if (req.query.search) {
    builder.where('institute.name LIKE :search OR institute.name LIKE :search', {
      search: `%${req.query.search}%`,
    });
  }

  if (req.query.sort) {
    const sortQuery = req.query.sort === '-institute_id' ? 'DESC' : 'ASC';
    builder.orderBy('institute.name', sortQuery);
  } 
  return await builder.getMany();
};

export const updateInstitute = async (instituteId: string, input: Partial<Institute>) => {
  const institute = await getInstitute(instituteId);
  if (!institute) {
    throw new Error('Institute not found');
  }

  // If email or password is being updated, also update the User record
  if (input.email || (input as any).password) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ user_id: instituteId });

    if (user) {
      if (input.email) {
        user.email = input.email;
      }
      if ((input as any).password && (input as any).password.trim() !== '') {
        user.password = (input as any).password; // This will be hashed by the User entity's @BeforeUpdate hook
      }
      await userRepository.save(user);
    }
  }
  
  // Remove institute_id from input to prevent overwriting the existing ID
  const { institute_id, ...updateData } = input;
  
  Object.assign(institute, updateData);
  return await instituteRepository.save(institute);
};

export const deleteInstitute = async (instituteId: string) => {
  const result = await instituteRepository.delete({ institute_id: instituteId });
  return result.affected && result.affected > 0;
};
