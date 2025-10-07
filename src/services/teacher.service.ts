
import { Request } from 'express';
import { User, RoleEnumType } from '../entities/User.entity';
import { AppDataSource } from '../utils/data-source';
import { UserDetails } from '../entities/userDetails.entity';
import { createUser } from './user.service';

const teacherRepository = AppDataSource.getRepository(UserDetails);

export const createTeacher = async (input: Partial<UserDetails> & { email?: string; password?: string }, currentUser: User) => {
  // Generate UUID if not provided
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const teacherId = input.userId || generateUUID();

  // Generate unique username to avoid conflicts
  const baseUserName = `${input.firstName?.toLowerCase() || 'teacher'}_${input.lastName?.toLowerCase() || 'user'}`;
  const uniqueUserName = `${baseUserName}_${Math.random().toString(36).substring(2, 8)}`;

  // First create a User for the teacher
  const teacherUser = await createUser({
    user_id: teacherId,
    userName: uniqueUserName,
    email: input.email || `${input.firstName?.toLowerCase() || 'teacher'}.${input.lastName?.toLowerCase() || 'user'}@edtech.com`,
    password: input.password || 'teacher12345', // Use provided password or default
    role: RoleEnumType.TEACHER,
    status: 'active',
    verified: true,
    verificationCode: 'verified', // Default verification code
    instituteId: currentUser.instituteId,
  });

  // Then create UserDetails linked to that User
  const userDetailsData = {
    ...input,
    user: teacherUser,
    userId: teacherId,
    updatedBy: currentUser.user_id,
    instituteId: currentUser.instituteId
  };

  // Remove any empty or null values that might cause issues
  Object.keys(userDetailsData).forEach(key => {
    if (userDetailsData[key] === '' || userDetailsData[key] === null || userDetailsData[key] === undefined) {
      delete userDetailsData[key];
    }
  });

  return await teacherRepository.save(teacherRepository.create(userDetailsData));
};

export const getTeacher = async (teacherId: string) => {
  return await teacherRepository.findOne({
    where: { userId: teacherId },
    relations: ['user']
  });
};

export const findTeachers = async (req: Request, user: User) => {
  const builder = teacherRepository.createQueryBuilder('UserDetails')
    .leftJoin('UserDetails.user', 'User')
    .where("User.role = 'teacher'")
    .andWhere('UserDetails.instituteId = :instituteId', { instituteId: user.instituteId })
    .select([
      'UserDetails.user_details_id',
      'UserDetails.userId',
      'UserDetails.instituteId',
      'UserDetails.firstName',
      'UserDetails.middleName',
      'UserDetails.lastName',
      'UserDetails.gender',
      'UserDetails.joiningDate',
      'UserDetails.dateOfBirth',
      'UserDetails.houseNo',
      'UserDetails.street',
      'UserDetails.postalCode',
      'UserDetails.state',
      'UserDetails.city',
      'UserDetails.country',
      'UserDetails.primaryContactNo',
      'UserDetails.secondaryContactNo',
      'UserDetails.createdAt',
      'UserDetails.updatedAt',
      'UserDetails.updatedBy',
      'User.user_id',
      'User.userName',
      'User.email',
      'User.role',
      'User.status'
    ]);

  if (req.query.search) {
    builder.andWhere('UserDetails.firstName LIKE :search OR UserDetails.lastName LIKE :search', {
      search: `%${req.query.search}%`,
    });
  }

  if (req.query.sort) {
    const sortQuery = req.query.sort === 'first_name' ? 'DESC' : 'ASC';
    builder.orderBy('UserDetails.firstName', sortQuery);
  }

  return await builder.getMany();
};

export const updateTeacher = async (teacherId: string, input: Partial<UserDetails> & { email?: string; password?: string }) => {
  const teacher = await getTeacher(teacherId);
  if (!teacher) {
    throw new Error('Teacher not found');
  }
  
  // If email or password is being updated, also update the User record
  if (input.email || (input.password && input.password.trim() !== '')) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ user_id: teacherId });
    
    if (user) {
      if (input.email) {
        user.email = input.email;
      }
      if (input.password && input.password.trim() !== '') {
        user.password = input.password; // This will be hashed by the User entity's @BeforeInsert hook
      }
      await userRepository.save(user);
    }
  }
  
  Object.assign(teacher, input);
  return await teacherRepository.save(teacher);
};

export const deleteTeacher = async (teacherId: string) => {
  const teacher = await getTeacher(teacherId);
  if (!teacher) {
    throw new Error('Teacher not found');
  }
  
  // Get the User repository
  const userRepository = AppDataSource.getRepository(User);
  
  // First delete the UserDetails record
  await teacherRepository.remove(teacher);
  
  // Then delete the associated User record
  const user = await userRepository.findOneBy({ user_id: teacherId });
  if (user) {
    await userRepository.remove(user);
  }
  
  return { success: true };
};
