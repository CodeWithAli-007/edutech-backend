import { z } from 'zod';

export const MCQQuestionSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500, 'Question too long'),
  options: z.object({
    A: z.string().min(1, 'Option A is required'),
    B: z.string().min(1, 'Option B is required'),
    C: z.string().min(1, 'Option C is required'),
    D: z.string().min(1, 'Option D is required'),
  }),
  correctAnswer: z.enum(['A', 'B', 'C', 'D'], {
    required_error: 'Correct answer is required',
  }),
  points: z.number().min(1, 'Points must be at least 1').max(100, 'Points cannot exceed 100'),
});

export const createExamSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID'),
    lessonId: z.string().uuid('Invalid lesson ID').optional(),
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    examType: z.enum(['quiz', 'midterm', 'annual', 'assignment'], {
      required_error: 'Exam type is required',
    }),
    examTotalMarks: z.number().min(1, 'Total marks must be at least 1'),
    noOfQuestions: z.number().min(1, 'Number of questions must be at least 1'),
    threshold: z.number().min(0, 'Threshold must be at least 0').max(100, 'Threshold cannot exceed 100'),
    questionFormat: z.array(MCQQuestionSchema).min(1, 'At least one question is required'),
    scheduledAt: z.string().datetime().optional().transform((str) => str ? new Date(str) : undefined),
  }),
});

export const updateExamSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    examType: z.enum(['quiz', 'midterm', 'annual', 'assignment']).optional(),
    examTotalMarks: z.number().min(1, 'Total marks must be at least 1').optional(),
    noOfQuestions: z.number().min(1, 'Number of questions must be at least 1').optional(),
    threshold: z.number().min(0, 'Threshold must be at least 0').max(100, 'Threshold cannot exceed 100').optional(),
    questionFormat: z.array(MCQQuestionSchema).min(1, 'At least one question is required').optional(),
    scheduledAt: z.string().datetime().optional().transform((str) => str ? new Date(str) : undefined),
  }),
  params: z.object({
    examId: z.string().uuid('Invalid exam ID'),
  }),
});

export const getExamSchema = z.object({
  params: z.object({
    examId: z.string().uuid('Invalid exam ID'),
  }),
});

export const deleteExamSchema = z.object({
  params: z.object({
    examId: z.string().uuid('Invalid exam ID'),
  }),
});

export const getExamsByCourseSchema = z.object({
  params: z.object({
    courseId: z.string().uuid('Invalid course ID'),
  }),
});

export const getTeacherExamsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    examType: z.enum(['quiz', 'midterm', 'annual', 'assignment']).optional(),
    courseId: z.string().uuid().optional(),
  }),
});

export type CreateExamInput = z.infer<typeof createExamSchema>['body'];
export type UpdateExamInput = z.infer<typeof updateExamSchema>['body'];
export type MCQQuestion = z.infer<typeof MCQQuestionSchema>;