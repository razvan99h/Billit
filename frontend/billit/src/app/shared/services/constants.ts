export const API_URL = 'http://192.168.100.87:3005/api/';
export const PASSWORD_REGEX = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';

/* ERROR MESSAGES */

// auth
export const ERROR_COUNTRY = 'Country should not be empty';
export const ERROR_EMAIL = 'Invalid email';
export const ERROR_PASSWORD = 'Password must contain at least 8 characters, one lowercase and one uppercase letter, a number and a special symbol';
export const ERROR_PASSWORD_MATCH = 'Passwords do not match';
export const ERROR_NAME = 'Country must not be empty';

// add-edit-bill -> bill info
export const ERROR_STORE_REQUIRED = 'Store name should not be empty';
export const ERROR_STORE_LONG = 'Store name too long';
export const ERROR_CATEGORY_REQUIRED = 'Category should not be empty';
export const ERROR_CATEGORY_LONG = 'Category too long';
export const ERROR_NUMBER_REQUIRED = 'Bill number should not be empty';
export const ERROR_NUMBER_LONG = 'Bill number too long';

// add-edit-bill -> products
export const ERROR_PRODUCT_NAME_REQUIRED = 'Name should not be empty';
export const ERROR_PRODUCT_NAME_LONG = 'Name too long';
export const ERROR_QUANTITY_INVALID = 'Invalid quantity';
export const ERROR_QUANTITY_BIG = 'Quantity too big';
export const ERROR_PRICE_INVALID = 'Invalid price';



