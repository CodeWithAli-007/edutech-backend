import 'dotenv/config';
import { AppDataSource } from '../src/utils/data-source';
import { User, RoleEnumType } from '../src/entities/User.entity';
import { Institute } from '../src/entities/institute.entity';
import { UserDetails, Gender } from '../src/entities/userDetails.entity';
import * as bcrypt from 'bcryptjs';

const demoUsers = [
  {
    userName: 'admin',
    email: 'admin@edtech.com',
    password: 'admin12345',
    role: RoleEnumType.ADMIN,
    status: 'active' as const,
    verified: true,
    verificationCode: 'verified_admin',
  },
  {
    userName: 'institute_admin',
    email: 'institute@edtech.com',
    password: 'institute12345',
    role: RoleEnumType.INSTITUTE_ADMIN,
    status: 'active' as const,
    verified: true,
    verificationCode: 'verified_institute',
  },
  {
    userName: 'teacher1',
    email: 'teacher1@edtech.com',
    password: 'teacher12345',
    role: RoleEnumType.TEACHER,
    status: 'active' as const,
    verified: true,
    verificationCode: 'verified_teacher1',
  },
  {
    userName: 'teacher2',
    email: 'teacher2@edtech.com',
    password: 'teacher12345',
    role: RoleEnumType.TEACHER,
    status: 'active' as const,
    verified: true,
    verificationCode: 'verified_teacher2',
  },
  {
    userName: 'student1',
    email: 'student1@edtech.com',
    password: 'student12345',
    role: RoleEnumType.STUDENT,
    status: 'active' as const,
    verified: true,
    verificationCode: 'verified_student1',
  },
  {
    userName: 'student2',
    email: 'student2@edtech.com',
    password: 'student12345',
    role: RoleEnumType.STUDENT,
    status: 'active' as const,
    verified: true,
    verificationCode: 'verified_student2',
  },
  {
    userName: 'student3',
    email: 'student3@edtech.com',
    password: 'student12345',
    role: RoleEnumType.STUDENT,
    status: 'active' as const,
    verified: true,
    verificationCode: 'verified_student3',
  },
];

const demoInstitutes = [
  {
    name: 'Tech University',
    city: 'Karachi',
    country: 'Pakistan',
    state: 'Sindh',
    email: 'info@techuniversity.edu.pk',
    web: 'https://techuniversity.edu.pk',
    mobileNo1: '+92-21-1234567',
    telephone1: '+92-21-1234568',
    houseNo: '123',
    street: 'University Road',
    postalCode: '75000',
  },
  {
    name: 'Science Academy',
    city: 'Lahore',
    country: 'Pakistan',
    state: 'Punjab',
    email: 'contact@scienceacademy.edu.pk',
    web: 'https://scienceacademy.edu.pk',
    mobileNo1: '+92-42-9876543',
    telephone1: '+92-42-9876544',
    houseNo: '456',
    street: 'Academic Street',
    postalCode: '54000',
  },
];

const demoUserDetails = [
  {
    firstName: 'John',
    lastName: 'Doe',
    middleName: '',
    gender: Gender.MALE,
    primaryContactNo: '+92-300-1234567',
    joiningDate: new Date('2023-01-15'),
    dateOfBirth: new Date('1990-05-15'),
    houseNo: '789',
    street: 'Main Street',
    city: 'Karachi',
    state: 'Sindh',
    country: 'Pakistan',
    postalCode: '75000',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    middleName: '',
    gender: Gender.FEMALE,
    primaryContactNo: '+92-300-2345678',
    joiningDate: new Date('2023-02-01'),
    dateOfBirth: new Date('1985-08-20'),
    houseNo: '321',
    street: 'Education Avenue',
    city: 'Lahore',
    state: 'Punjab',
    country: 'Pakistan',
    postalCode: '54000',
  },
  {
    firstName: 'Ahmed',
    lastName: 'Khan',
    middleName: '',
    gender: Gender.MALE,
    primaryContactNo: '+92-300-3456789',
    joiningDate: new Date('2023-03-10'),
    dateOfBirth: new Date('1988-12-10'),
    houseNo: '654',
    street: 'Teacher Lane',
    city: 'Karachi',
    state: 'Sindh',
    country: 'Pakistan',
    postalCode: '75000',
  },
  {
    firstName: 'Fatima',
    lastName: 'Ali',
    middleName: '',
    gender: Gender.FEMALE,
    primaryContactNo: '+92-300-4567890',
    joiningDate: new Date('2023-04-05'),
    dateOfBirth: new Date('1992-03-25'),
    houseNo: '987',
    street: 'Student Street',
    city: 'Lahore',
    state: 'Punjab',
    country: 'Pakistan',
    postalCode: '54000',
  },
  {
    firstName: 'Muhammad',
    lastName: 'Hassan',
    middleName: '',
    gender: Gender.MALE,
    primaryContactNo: '+92-300-5678901',
    joiningDate: new Date('2023-05-20'),
    dateOfBirth: new Date('1995-07-12'),
    houseNo: '147',
    street: 'Learning Road',
    city: 'Karachi',
    state: 'Sindh',
    country: 'Pakistan',
    postalCode: '75000',
  },
  {
    firstName: 'Aisha',
    lastName: 'Malik',
    middleName: '',
    gender: Gender.FEMALE,
    primaryContactNo: '+92-300-6789012',
    joiningDate: new Date('2023-06-15'),
    dateOfBirth: new Date('1993-11-08'),
    houseNo: '258',
    street: 'Study Avenue',
    city: 'Lahore',
    state: 'Punjab',
    country: 'Pakistan',
    postalCode: '54000',
  },
  {
    firstName: 'Ali',
    lastName: 'Raza',
    middleName: '',
    gender: Gender.MALE,
    primaryContactNo: '+92-300-7890123',
    joiningDate: new Date('2023-07-01'),
    dateOfBirth: new Date('1994-09-30'),
    houseNo: '369',
    street: 'Education Boulevard',
    city: 'Karachi',
    state: 'Sindh',
    country: 'Pakistan',
    postalCode: '75000',
  },
];

async function seedDemoData() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connected successfully!');

    // Clear existing data
    console.log('Clearing existing data...');
    await AppDataSource.getRepository(UserDetails).delete({});
    await AppDataSource.getRepository(Institute).delete({});
    // Delete courses first, then users
    await AppDataSource.query('DELETE FROM course');
    await AppDataSource.getRepository(User).delete({});

    // Create users first (without institute references)
    console.log('Creating demo users...');
    const userRepo = AppDataSource.getRepository(User);
    const createdUsers = [];
    
    for (let i = 0; i < demoUsers.length; i++) {
      const userData = {
        ...demoUsers[i],
        password: demoUsers[i].password, // Don't hash here, let @BeforeInsert handle it
        instituteId: null, // Will be updated later
      };
      const user = userRepo.create(userData);
      const savedUser = await userRepo.save(user);
      createdUsers.push(savedUser);
      console.log(`Created user: ${savedUser.userName} (${savedUser.role})`);
    }

    // Create institutes
    console.log('Creating demo institutes...');
    const instituteRepo = AppDataSource.getRepository(Institute);
    const createdInstitutes = [];
    const adminUser = createdUsers.find(u => u.role === RoleEnumType.ADMIN);
    
    for (let i = 0; i < demoInstitutes.length; i++) {
      const instituteData = {
        ...demoInstitutes[i],
        updatedBy: adminUser?.user_id || createdUsers[0].user_id,
      };
      const institute = instituteRepo.create(instituteData);
      const savedInstitute = await instituteRepo.save(institute);
      createdInstitutes.push(savedInstitute);
      console.log(`Created institute: ${savedInstitute.name}`);
    }

    // Update users with institute references
    console.log('Updating users with institute references...');
    for (let i = 0; i < createdUsers.length; i++) {
      if (i === 1) { // Institute admin
        createdUsers[i].instituteId = createdInstitutes[0].institute_id;
      } else if (i >= 2) { // Teachers and students
        createdUsers[i].instituteId = createdInstitutes[i % 2].institute_id;
      }
      await userRepo.save(createdUsers[i]);
    }

    // Create user details
    console.log('Creating user details...');
    const userDetailsRepo = AppDataSource.getRepository(UserDetails);
    
    for (let i = 0; i < demoUserDetails.length; i++) {
      if (i + 1 < createdUsers.length) { // Check if user exists
        const userDetailsData = {
          ...demoUserDetails[i],
          userId: createdUsers[i + 1].user_id, // Skip admin user (index 0)
          instituteId: createdUsers[i + 1].instituteId,
          updatedBy: createdUsers[0].user_id, // Admin user as updatedBy
        };
        const userDetails = userDetailsRepo.create(userDetailsData);
        const savedUserDetails = await userDetailsRepo.save(userDetails);
        console.log(`Created user details for: ${savedUserDetails.firstName} ${savedUserDetails.lastName}`);
      }
    }

    console.log('\n✅ Demo data seeded successfully!');
    console.log('\n📋 Created Users:');
    createdUsers.forEach(user => {
      console.log(`  - ${user.userName} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log('\n🏫 Created Institutes:');
    createdInstitutes.forEach(institute => {
      console.log(`  - ${institute.name} (${institute.city}, ${institute.country})`);
    });

    console.log('\n🔑 Login Credentials:');
    console.log('  Admin: admin@edtech.com / admin12345');
    console.log('  Institute Admin: institute@edtech.com / institute12345');
    console.log('  Teacher 1: teacher1@edtech.com / teacher12345');
    console.log('  Teacher 2: teacher2@edtech.com / teacher12345');
    console.log('  Student 1: student1@edtech.com / student12345');
    console.log('  Student 2: student2@edtech.com / student12345');
    console.log('  Student 3: student3@edtech.com / student12345');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('\nDatabase connection closed.');
  }
}

seedDemoData();
