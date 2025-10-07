
import { Request } from 'express';
import { User } from '../entities/User.entity';
import { AppDataSource } from '../utils/data-source';
import { UserDetails } from '../entities/userDetails.entity';
import { createUser, findUserByEmail } from './user.service';

const studentRepository = AppDataSource.getRepository(UserDetails);

export const createStudent = async (input: Partial<UserDetails>, currentUser: User) => {
  // Check if email already exists
  const email = input.email || `${input.firstName?.toLowerCase() || 'student'}.${input.lastName?.toLowerCase() || 'user'}@edtech.com`;
  const existingUser = await findUserByEmail({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Generate UUID if not provided
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const studentId = input.userId || generateUUID();

  // Generate unique username to avoid conflicts
  const baseUserName = `${input.firstName?.toLowerCase() || 'student'}_${input.lastName?.toLowerCase() || 'user'}`;
  const uniqueUserName = `${baseUserName}_${Math.random().toString(36).substring(2, 8)}`;

  // First create a User for the student
  const studentUser = await createUser({
    user_id: studentId,
    userName: uniqueUserName,
    email: email,
    password: input.password || 'student12345', // Use provided password or default
    role: 'student',
    status: 'active',
    verified: true,
    verificationCode: 'verified', // Default verification code
    instituteId: currentUser.instituteId,
  });

  // Then create UserDetails linked to that User
  const userDetailsData = {
    ...input,
    user: studentUser,
    userId: studentId,
    updatedBy: currentUser.user_id,
    instituteId: currentUser.instituteId
  };

  // Remove any empty or null values that might cause issues
  Object.keys(userDetailsData).forEach(key => {
    if (userDetailsData[key] === '' || userDetailsData[key] === null || userDetailsData[key] === undefined) {
      delete userDetailsData[key];
    }
  });

  return await studentRepository.save(studentRepository.create(userDetailsData));
};

export const getStudent = async (userId: string) => {
  return await studentRepository.findOne({
    where: { userId: userId },
    relations: ['user']
  });
};

export const updateStudent = async (studentId: string, input: Partial<UserDetails>) => {
  const student = await getStudent(studentId);
  if (!student) {
    throw new Error('Student not found');
  }
  
  // If email or password is being updated, also update the User record
  if (input.email || (input.password && input.password.trim() !== '')) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ user_id: studentId });
    
    if (user) {
      if (input.email) {
        user.email = input.email;
      }
      if (input.password && input.password.trim() !== '') {
        user.password = input.password; // This will be hashed by the User entity's @BeforeUpdate hook
      }
      await userRepository.save(user);
    }
  }
  
  Object.assign(student, input);
  return await studentRepository.save(student);
};

export const findStudents = async (req: Request, user: User) => {
  const builder = studentRepository.createQueryBuilder('UserDetails')
    .leftJoin('UserDetails.user', 'User')
    .where("User.role = 'student'")
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
    const sortQuery = req.query.sort === 'last_name' ? 'DESC' : 'ASC';
    builder.orderBy('UserDetails.firstName', sortQuery);
  }

  return await builder.getMany();
};
