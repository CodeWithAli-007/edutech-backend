
import { any, object, string, TypeOf } from 'zod';
import { Institute } from '../entities/institute.entity';
export const createInstituteSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    houseNo: string().optional(),
    street: string().optional(),
    postalCode: string().optional(),
    state: string().optional(),
    city: string({
      required_error: 'City is required',
    }),
    country: string({
      required_error: 'Country is required',
    }),
    mobileNo1: string().optional(),
    mobileNo2: string().optional(),
    telephone1: string().optional(),
    telephone2: string().optional(),
    email: string().email('Invalid email format').optional(),
    password: string().optional().refine((val) => !val || val === '' || val.length >= 6, {
      message: 'Password must be at least 6 characters'
    }),
    web: string().optional().refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), {
      message: 'Invalid URL format'
    }),
    createdAt: any(),
    updatedAt: any(),
    updatedBy: string({
      required_error: 'user is required',
    })
  }),
});

const params = {
  params: object({
    instituteId: string().uuid('Invalid institute ID format'),
  }),
};

export const getInstituteSchema = object({
  ...params,
});

export const updateInstituteSchema = object({
  ...params,
  body: object({
    instituteId: string().optional(),
    name: string().optional(),
    houseNo: string().optional(),
    street: string().optional(),
    postalCode: string().optional(),
    state: string().optional(),
    city: string().optional(),
    country: string().optional(),
    mobileNo1: string().optional(),
    mobileNo2: string().optional(),
    telephone1: string().optional(),
    telephone2: string().optional(),
    email: string().email('Invalid email format').optional(),
    password: string().optional().refine((val) => !val || val === '' || val.length >= 6, {
      message: 'Password must be at least 6 characters'
    }),
    web: string().optional().refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), {
      message: 'Invalid URL format'
    }),
    createdAt: any(),
    updatedAt: any(),
    updatedBy: string().optional()
  }).partial(),
});


export const mapResponseToInstitute = (response: any) => {
  return {
    institute_id: response.instituteId,
    name: response.name,
    houseNo: response.houseNo,
    street: response.street,
    postalCode: response.postalCode,
    state: response.state,
    city: response.city,
    country: response.country,
    mobileNo1: response.mobileNo1,
    mobileNo2: response.mobileNo2,
    telephone1: response.telephone1,
    telephone2: response.telephone2,
    email: response.email,
    password: response.password,
    web: response.web,
    createdAt: response?.createdAt,
    updatedAt: response.updatedAt,
    updatedBy: response.updatedBy
  };
}

export const deleteInstituteSchema = object({
  ...params,
});

export type CreateInstituteInput = TypeOf<typeof createInstituteSchema>['body'];
export type GetInstituteInput = TypeOf<typeof getInstituteSchema>['params'];
export type UpdateInstituteInput = TypeOf<typeof updateInstituteSchema>;
export type DeleteInstituteInput = TypeOf<typeof deleteInstituteSchema>['params'];
