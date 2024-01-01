export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

export const SLUG_REGEX = /^[-a-zA-Z0-9]*$/i;
export const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const { DEFAULT_DOMAIN } = process.env;

/* Minimum 8 and maximum 16 characters, at least one uppercase letter,
one lowercase letter, one number and one special character
*/
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
export const SALT_ROUNDS = 10;
