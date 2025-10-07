
import { any, object, string, TypeOf } from 'zod';
import { createUserDetailsSchema, updateUserDetailsSchema } from './userDetails.schema';
export const createTeacherSchema = createUserDetailsSchema

const params = {
    params: object({
        teacherId: string(),
        firstName: string(),
        middleName: string(),
        lastName: string(),
    }),
};

export const getTeacherSchema = object({
    params: object({
        teacherId: string(),
        firstName: string().optional(),
        middleName: string().optional(),
        lastName: string().optional(),
    }),
});

export const updateTeacherSchema = object({
    params: object({
        teacherId: string(),
    }),
    body: object({
        firstName: string().optional(),
        lastName: string().optional(),
        middleName: string().optional(),
        primaryContactNo: string().optional(),
        secondaryContactNo: string().optional(),
        houseNo: string().optional(),
        street: string().optional(),
        city: string().optional(),
        state: string().optional(),
        country: string().optional(),
        postalCode: string().optional(),
        gender: string().optional(),
        dateOfBirth: string().optional(),
        dateOfJoining: string().optional(),
        updatedBy: string().optional(),
        instituteId: string().optional(),
    }),
});

export const deleteTeacherSchema = object({
    params: object({
        teacherId: string(),
    }),
});

export const mapResponseToTeacher = (response: any) => {
    return {
        teacher_id: response.teacherId,
        firstName: response.firstName,
        middleName: response.middleName,
        lastName: response.lastName,
        houseNo: response.houseNo,
        street: response.street,
        postal_code: response.postalCode,
        state: response.state,
        city: response.city,
        country: response.country,
        mobileNo1: response.mobileNo1,
        mobileNo2: response.mobileNo2,
        telephone1: response.telephone1,
        email: response.email,
        instituteId: response.instituteId,
        createdAt: response?.createdAt,
        updatedAt: response.updatedAt,
    };
}

export type CreateTeacherInput = TypeOf<typeof createTeacherSchema>['body'];
export type GetTeacherInput = TypeOf<typeof getTeacherSchema>['params'];
export type UpdateTeacherInput = TypeOf<typeof updateTeacherSchema>;
export type DeleteTeacherInput = TypeOf<typeof deleteTeacherSchema>['params'];
