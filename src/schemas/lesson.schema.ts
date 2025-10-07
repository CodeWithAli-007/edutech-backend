import { z } from 'zod';

export const createLessonSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID format'),
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    lesson_type: z.enum(['transcript', 'video', 'text'], {
      errorMap: () => ({ message: 'Lesson type must be transcript, video, or text' })
    }),
    lessonUrl: z.string().url('Invalid URL format').max(200, 'URL must be less than 200 characters'),
    status: z.enum(['active', 'inactive']).optional().default('active'),
    position: z.number().int().positive().optional(),
    hasExam: z.boolean().optional().default(false),
  })
});

export const updateLessonSchema = z.object({
  params: z.object({
    lessonId: z.string().uuid('Invalid lesson ID format'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').optional(),
    lesson_type: z.enum(['transcript', 'video', 'text']).optional(),
    lessonUrl: z.string().url('Invalid URL format').max(200, 'URL must be less than 200 characters').optional(),
    status: z.enum(['active', 'inactive']).optional(),
    position: z.number().int().positive().optional(),
    hasExam: z.boolean().optional(),
  })
});

export const getLessonSchema = z.object({
  params: z.object({
    lessonId: z.string().uuid('Invalid lesson ID format'),
  })
});

export const deleteLessonSchema = z.object({
  params: z.object({
    lessonId: z.string().uuid('Invalid lesson ID format'),
  })
});

export const getLessonsByCourseSchema = z.object({
  params: z.object({
    courseId: z.string().uuid('Invalid course ID format'),
  })
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type GetLessonInput = z.infer<typeof getLessonSchema>;
export type DeleteLessonInput = z.infer<typeof deleteLessonSchema>;
export type GetLessonsByCourseInput = z.infer<typeof getLessonsByCourseSchema>;