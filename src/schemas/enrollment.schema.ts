import { z } from 'zod';

// Schema for creating enrollment
export const createEnrollmentSchema = z.object({
  body: z.object({
    studentId: z.string({
      required_error: 'Student ID is required',
    }).uuid('Student ID must be a valid UUID'),
    courseId: z.string({
      required_error: 'Course ID is required',
    }).uuid('Course ID must be a valid UUID'),
  }),
});

// Schema for getting enrollment by ID
export const getEnrollmentSchema = z.object({
  params: z.object({
    enrollmentId: z.string({
      required_error: 'Enrollment ID is required',
    }).uuid('Enrollment ID must be a valid UUID'),
  }),
});

// Schema for updating enrollment
export const updateEnrollmentSchema = z.object({
  params: z.object({
    enrollmentId: z.string({
      required_error: 'Enrollment ID is required',
    }).uuid('Enrollment ID must be a valid UUID'),
  }),
  body: z.object({
    studentId: z.string().uuid('Student ID must be a valid UUID').optional(),
    courseId: z.string().uuid('Course ID must be a valid UUID').optional(),
  }),
});

// Schema for deleting enrollment
export const deleteEnrollmentSchema = z.object({
  params: z.object({
    enrollmentId: z.string({
      required_error: 'Enrollment ID is required',
    }).uuid('Enrollment ID must be a valid UUID'),
  }),
});

// Schema for getting enrollments by student
export const getEnrollmentsByStudentSchema = z.object({
  params: z.object({
    studentId: z.string({
      required_error: 'Student ID is required',
    }).uuid('Student ID must be a valid UUID'),
  }),
});

// Schema for getting enrollments by course
export const getEnrollmentsByCourseSchema = z.object({
  params: z.object({
    courseId: z.string({
      required_error: 'Course ID is required',
    }).uuid('Course ID must be a valid UUID'),
  }),
});

// Schema for getting enrollments by institute
export const getEnrollmentsByInstituteSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
  }),
});

// Type definitions
export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type GetEnrollmentInput = z.infer<typeof getEnrollmentSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;
export type DeleteEnrollmentInput = z.infer<typeof deleteEnrollmentSchema>;
export type GetEnrollmentsByStudentInput = z.infer<typeof getEnrollmentsByStudentSchema>;
export type GetEnrollmentsByCourseInput = z.infer<typeof getEnrollmentsByCourseSchema>;
export type GetEnrollmentsByInstituteInput = z.infer<typeof getEnrollmentsByInstituteSchema>;
