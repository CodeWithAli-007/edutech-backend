
import z, { any, object, string, TypeOf } from 'zod';
import { Gender, UserType } from '../entities/userDetails.entity';
export const createUserDetailsSchema = object({
    body: object({
        userId: string().optional().default(() => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        })),
        firstName: string({
            required_error: 'first Name is required',
        }),
        middleName: string().optional(),
        lastName: string({
            required_error: 'last Name is required',
        }),
        updatedBy: string({
            required_error: 'user is required',
        }),
        userType: z.optional(z.nativeEnum(UserType)),
        street: string().optional(),
        houseNo: string().optional(),
        postalCode: string().optional(),
        state: string().optional(),
        city: string().optional(),
        country: string().optional(),
        primaryContactNo: string().optional(),
        secondaryContactNo: string().optional(),
        instituteId: string({
            required_error: 'instituteId is required',
        }),
        email: string().email('Invalid email format').optional(),
        password: string().min(6, 'Password must be at least 6 characters').optional(),

        DateOfBirth: any(),
        DateOfJoining: any(),
        gender: z.optional(z.nativeEnum(Gender)),
        createdAt: any(),
        updatedAt: any()
    }),
});

const params = {
    params: object({
        userId: string(),
        firstName: string(),
        middleName: string(),
        lastName: string(),
    }),
};

export const getUserDetailsSchema = object({
    ...params,
});

export const updateUserDetailsSchema = object({
    ...params,
    body: object({
        userId: string().optional(),
        firstName: string({
            required_error: 'first Name is required',
        }),
        middleName: string().optional(),
        lastName: string({
            required_error: 'last Name is required',
        }),
        updatedBy: string({
            required_error: 'user is required',
        }),
        userType: z.optional(z.nativeEnum(UserType)),
        street: string().optional(),
        houseNo: string().optional(),
        postalCode: string().optional(),
        state: string().optional(),
        city: string().optional(),
        country: string().optional(),
        primaryContactNo: string().optional(),
        secondaryContactNo: string().optional(),
        instituteId: string({
            required_error: 'instituteId is required',
        }),
        email: string().email('Invalid email format').optional(),
        password: string().min(6, 'Password must be at least 6 characters').optional(),
        DateOfBirth: any(),
        DateOfJoining: any(),
        gender: string(),
        createdAt: any(),
        updatedAt: any()
    }).partial(),
});

export const deleteUserDetailsSchema = object({
    ...params,
});

export const mapResponseToUserDetails = (response: any) => {
    const mapped = {
        userId: response.userId,
        firstName: response.firstName,
        middleName: response.middleName,
        lastName: response.lastName,
        userType: response.userType,
        houseNo: response.houseNo,
        street: response.street,
        postalCode: response.postalCode,
        state: response.state,
        city: response.city,
        country: response.country,
        primaryContactNo: response.primaryContactNo,
        secondaryContactNo: response.secondaryContactNo,
        dateOfBirth: response.dateOfBirth,
        dateOfJoining: response.dateOfJoining,
        gender: response.gender,
        instituteId: response.instituteId,
        email: response.email,
        password: response.password,
        updatedBy: response.updatedBy,
        createdAt: response?.createdAt,
        updatedAt: response.updatedAt,
    };

    // Remove null, undefined, and empty string values
    Object.keys(mapped).forEach(key => {
        if (mapped[key] === null || mapped[key] === undefined || mapped[key] === '') {
            delete mapped[key];
        }
    });

    return mapped;
}

export type CreateUserDetailsInput = TypeOf<typeof createUserDetailsSchema>['body'];
export type GetUserDetailsInput = TypeOf<typeof getUserDetailsSchema>['params'];
export type UpdateUserDetailsInput = TypeOf<typeof updateUserDetailsSchema>;
export type DeleteUserDetailsInput = TypeOf<typeof deleteUserDetailsSchema>['params'];
