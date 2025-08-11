// Users and Permissions
export const USER_ROLE_ENUM = ['Admin', 'User'] as const;
export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).*$/;
export const AUTH_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 2;
export const RENEW_WINDOW_MINUTES = 10;

// Products
export const VALID_SIZES_ENUM = ['S', 'M', 'L', 'XL', 'XXL'] as const;

// File Upload
export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const MAX_PRODUCT_IMAGES = 4;
