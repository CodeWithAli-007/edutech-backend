import { Request } from 'express';
import { User } from '../entities/User.entity';
import { AppDataSource } from '../utils/data-source';
import { Enrollment } from '../entities/enrollment.entity';
import { Course } from '../entities/course.entity';
import { RoleEnumType } from '../entities/User.entity';

const enrollmentRepository = AppDataSource.getRepository(Enrollment);
const courseRepository = AppDataSource.getRepository(Course);

export const createEnrollment = async (input: Partial<Enrollment>, user: User) => {
  // Check if user has institute_admin role
  if (user.role !== RoleEnumType.INSTITUTE_ADMIN) {
    throw new Error('Only institute admins can enroll students to courses');
  }

  // Verify that the course exists and belongs to the user's institute
  const course = await courseRepository.findOne({
    where: { course_id: input.courseId },
    relations: ['user']
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Check if the course belongs to the user's institute
  if (course.instituteId !== user.instituteId) {
    throw new Error('You can only enroll students in courses from your institute');
  }

  // Check if student exists and belongs to the same institute
  const student = await AppDataSource.getRepository(User).findOne({
    where: { user_id: input.studentId }
  });

  if (!student) {
    throw new Error('Student not found');
  }

  if (student.role !== RoleEnumType.STUDENT) {
    throw new Error('User is not a student');
  }

  if (student.instituteId !== user.instituteId) {
    throw new Error('Student must belong to your institute');
  }

  // Check if enrollment already exists
  const existingEnrollment = await enrollmentRepository.findOne({
    where: {
      studentId: input.studentId,
      courseId: input.courseId
    }
  });

  if (existingEnrollment) {
    throw new Error('Student is already enrolled in this course');
  }

  return await enrollmentRepository.save(enrollmentRepository.create({
    ...input,
    updatedBy: user.user_id
  }));
};

export const getEnrollment = async (enrollmentId: string) => {
  return await enrollmentRepository.findOne({
    where: { enrollment_id: enrollmentId },
    relations: ['user', 'course']
  });
};

export const findEnrollmentsByStudent = async (studentId: string, user: User) => {
  // Check if user has institute_admin role or is the student themselves
  if (user.role !== RoleEnumType.INSTITUTE_ADMIN && user.user_id !== studentId) {
    throw new Error('Access denied');
  }

  // If user is institute admin, verify student belongs to their institute
  if (user.role === RoleEnumType.INSTITUTE_ADMIN) {
    const student = await AppDataSource.getRepository(User).findOne({
      where: { user_id: studentId }
    });

    if (!student || student.instituteId !== user.instituteId) {
      throw new Error('Student not found in your institute');
    }
  }

  return await enrollmentRepository.find({
    where: { studentId },
    relations: ['user', 'course'],
    order: { enrolledAt: 'DESC' }
  });
};

export const findEnrollmentsByCourse = async (courseId: string, user: User) => {
  // Check if user has institute_admin role or is the teacher of the course
  if (user.role !== RoleEnumType.INSTITUTE_ADMIN && user.role !== RoleEnumType.TEACHER) {
    throw new Error('Access denied');
  }

  // Verify that the course exists
  const course = await courseRepository.findOne({
    where: { course_id: courseId },
    relations: ['user']
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Check if user has access to this course
  if (user.role === RoleEnumType.INSTITUTE_ADMIN) {
    if (course.instituteId !== user.instituteId) {
      throw new Error('Course not found in your institute');
    }
  } else if (user.role === RoleEnumType.TEACHER) {
    if (course.teacherId !== user.user_id) {
      throw new Error('You can only view enrollments for courses assigned to you');
    }
  }

  return await enrollmentRepository.find({
    where: { courseId },
    relations: ['user', 'course'],
    order: { enrolledAt: 'DESC' }
  });
};

export const findEnrollmentsByInstitute = async (req: Request, user: User) => {
  // Check if user has institute_admin role
  if (user.role !== RoleEnumType.INSTITUTE_ADMIN) {
    throw new Error('Only institute admins can view all enrollments');
  }

  const builder = enrollmentRepository.createQueryBuilder('enrollment')
    .leftJoinAndSelect('enrollment.user', 'user')
    .leftJoinAndSelect('enrollment.course', 'course')
    .leftJoinAndSelect('course.user', 'teacher')
    .where('user.instituteId = :instituteId', { instituteId: user.instituteId });

  if (req.query.search) {
    builder.andWhere(
      '(user.userName ILIKE :search OR course.title ILIKE :search)',
      { search: `%${req.query.search}%` }
    );
  }

  // Pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  builder.skip(skip).take(limit);

  const [enrollments, total] = await builder.getManyAndCount();

  return {
    enrollments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

export const updateEnrollment = async (enrollmentId: string, input: Partial<Enrollment>, user: User) => {
  // Check if user has institute_admin role
  if (user.role !== RoleEnumType.INSTITUTE_ADMIN) {
    throw new Error('Only institute admins can update enrollments');
  }

  const enrollment = await enrollmentRepository.findOne({
    where: { enrollment_id: enrollmentId },
    relations: ['user', 'course']
  });

  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  // Verify that the enrollment belongs to the user's institute
  if (enrollment.user.instituteId !== user.instituteId) {
    throw new Error('Enrollment not found in your institute');
  }

  // If updating courseId, verify the new course belongs to the institute
  if (input.courseId && input.courseId !== enrollment.courseId) {
    const course = await courseRepository.findOne({
      where: { course_id: input.courseId }
    });

    if (!course || course.instituteId !== user.instituteId) {
      throw new Error('Course not found in your institute');
    }

    // Check if enrollment already exists for the new course
    const existingEnrollment = await enrollmentRepository.findOne({
      where: {
        studentId: enrollment.studentId,
        courseId: input.courseId
      }
    });

    if (existingEnrollment) {
      throw new Error('Student is already enrolled in this course');
    }
  }

  // If updating studentId, verify the new student belongs to the institute
  if (input.studentId && input.studentId !== enrollment.studentId) {
    const student = await AppDataSource.getRepository(User).findOne({
      where: { user_id: input.studentId }
    });

    if (!student || student.instituteId !== user.instituteId || student.role !== RoleEnumType.STUDENT) {
      throw new Error('Student not found in your institute');
    }

    // Check if enrollment already exists for the new student
    const existingEnrollment = await enrollmentRepository.findOne({
      where: {
        studentId: input.studentId,
        courseId: enrollment.courseId
      }
    });

    if (existingEnrollment) {
      throw new Error('Student is already enrolled in this course');
    }
  }

  Object.assign(enrollment, input, { updatedBy: user.user_id });
  return await enrollmentRepository.save(enrollment);
};

export const deleteEnrollment = async (enrollmentId: string, user: User) => {
  // Check if user has institute_admin role
  if (user.role !== RoleEnumType.INSTITUTE_ADMIN) {
    throw new Error('Only institute admins can delete enrollments');
  }

  const enrollment = await enrollmentRepository.findOne({
    where: { enrollment_id: enrollmentId },
    relations: ['user', 'course']
  });

  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  // Verify that the enrollment belongs to the user's institute
  if (enrollment.user.instituteId !== user.instituteId) {
    throw new Error('Enrollment not found in your institute');
  }

  await enrollmentRepository.remove(enrollment);
  return true;
};

// Get available students for enrollment (students from the same institute)
export const getAvailableStudents = async (user: User) => {
  // Check if user has institute_admin role
  if (user.role !== RoleEnumType.INSTITUTE_ADMIN) {
    throw new Error('Only institute admins can view available students');
  }

  return await AppDataSource.getRepository(User).createQueryBuilder('user')
    .leftJoinAndSelect('user.userDetails', 'userDetails')
    .where('user.role = :role', { role: RoleEnumType.STUDENT })
    .andWhere('user.instituteId = :instituteId', { instituteId: user.instituteId })
    .select([
      'user.user_id',
      'user.userName', 
      'user.email',
      'userDetails.firstName',
      'userDetails.lastName'
    ])
    .getMany();
};

// Get available courses for enrollment (courses from the same institute)
export const getAvailableCourses = async (user: User) => {
  // Check if user has institute_admin role
  if (user.role !== RoleEnumType.INSTITUTE_ADMIN) {
    throw new Error('Only institute admins can view available courses');
  }

  return await courseRepository.find({
    where: {
      instituteId: user.instituteId
    },
    relations: ['user'],
    select: ['course_id', 'title', 'description', 'user']
  });
};
