
import { any, object, string, TypeOf } from 'zod';
import { createUserDetailsSchema, updateUserDetailsSchema } from './userDetails.schema';
export const createStudentSchema = createUserDetailsSchema;

const getParams = {
    params: object({
        studentId: string(),
    }),
};

const deleteParams = {
    params: object({
        studentId: string(),
    }),
};

export const getStudentSchema = object({
    ...getParams,
});

export const updateStudentSchema = object({
    params: object({
        studentId: string(),
    }),
    body: object({
        firstName: string().optional(),
        lastName: string().optional(),
        middleName: string().nullable().optional(),
        email: string().email('Invalid email format').optional(),
        password: string().min(6, 'Password must be at least 6 characters').nullable().optional(),
        primaryContactNo: string().nullable().optional(),
        secondaryContactNo: string().nullable().optional(),
        houseNo: string().nullable().optional(),
        street: string().nullable().optional(),
        city: string().nullable().optional(),
        state: string().nullable().optional(),
        country: string().nullable().optional(),
        postalCode: string().nullable().optional(),
        gender: string().nullable().optional(),
        dateOfBirth: string().nullable().optional(),
        dateOfJoining: string().nullable().optional(),
        updatedBy: string().optional(),
        instituteId: string().optional(),
    }),
});

export const deleteStudentSchema = object({
    ...deleteParams,
});

export type CreateStudentInput = TypeOf<typeof createStudentSchema>['body'];
export type GetStudentInput = TypeOf<typeof getStudentSchema>['params'];
export type UpdateStudentInput = TypeOf<typeof updateStudentSchema>;
export type DeleteStudentInput = TypeOf<typeof deleteStudentSchema>['params'];
