// Users and Permissions
export const USER_ROLE_ENUM = ['Admin', 'User'] as const;
export const ADDRESS_TYPE_ENUM = ['Home', 'Work', 'Other'] as const;

export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).*$/;
export const AUTH_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 2;
export const RENEW_WINDOW_MINUTES = 10;

// Products
export const VALID_SIZES_ENUM = ['S', 'M', 'L', 'XL', 'XXL'] as const;

// File Upload
export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const MAX_PRODUCT_IMAGES = 4;

//Orders and Status
export const VALID_ORDER_STATUSES_ENUM = [
  'Order placed',
  'Ready to ship',
  'Shipped',
  'Delivered',
  'Cancelled',
] as const;

// Address
export const POSTAL_CODE_REGEX = /^\d{5}-?\d{3}$/;
