import { Request } from 'express';
import { User } from '../entities/User.entity';
import { AppDataSource } from '../utils/data-source';
import { Course } from '../entities/course.entity';

const courseRepository = AppDataSource.getRepository(Course);

export const createCourse = async (input: Partial<Course>, user: User) => {
  return await courseRepository.save(courseRepository.create({ 
    ...input, 
    teacherId: input.teacherId || null, // Allow null if no teacher assigned
    instituteId: user.instituteId,
    updatedBy: user.user_id 
  }));
};

export const getCourse = async (courseId: string) => {
  return await courseRepository.findOne({
    where: { course_id: courseId },
    relations: ['user']
  });
};

export const findCourses = async (req: Request, user: User) => {
  const builder = courseRepository.createQueryBuilder('Course')
    .leftJoinAndSelect('Course.user', 'User')
    .where('Course.instituteId = :instituteId', { instituteId: user.instituteId });

  if (req.query.search) {
    builder.andWhere('Course.title LIKE :search OR Course.description LIKE :search', {
      search: `%${req.query.search}%`,
    });
  }

  if (req.query.sort) {
    const sortQuery = req.query.sort === 'title' ? 'DESC' : 'ASC';
    builder.orderBy('Course.title', sortQuery);
  }

  return await builder.getMany();
};

export const updateCourse = async (courseId: string, input: Partial<Course>, user: User) => {
  return await courseRepository.update(
    { course_id: courseId },
    { ...input, updatedBy: user.user_id }
  );
};

export const deleteCourse = async (courseId: string) => {
  return await courseRepository.delete({ course_id: courseId });
};

export const assignTeacherToCourse = async (courseId: string, teacherId: string, user: User) => {
  return await courseRepository.update(
    { course_id: courseId },
    { teacherId, updatedBy: user.user_id }
  );
};

