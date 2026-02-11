import { customAlphabet } from 'nanoid';

import { COOKIE_TOKEN_NAME } from '../../config/const';

const NUMBER_ALPHABET = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const generateClientId = customAlphabet(NUMBER_ALPHABET, 8);

export const getAuthToken = req => req.cookies[COOKIE_TOKEN_NAME];
