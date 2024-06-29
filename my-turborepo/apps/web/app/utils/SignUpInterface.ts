export interface SignUpInterface {
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    city: string;
    country: string;
    pinCode: string;
    address: string;
    username: string;
    password: string;
    category: 'farmer' | 'buyer' | 'retailer';
}