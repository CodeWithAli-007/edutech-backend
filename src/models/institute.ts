export interface Institute {
    institute_id: string;
    name: string;
    house_no?: string,
    street?: string,
    postal_code?: string,
    state?: string,
    city: string,
    country: string,
    mobile_no1: string,
    mobile_no2?: string,
    telephone1: string,
    telephone2?: string,
    email: string,
    web?: string,
    created_at: Date;
    updated_at: Date;
}