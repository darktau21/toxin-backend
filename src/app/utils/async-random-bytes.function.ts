import { randomBytes } from 'crypto';
import { promisify } from 'util';

export const asyncRandomBytes = promisify(randomBytes);
