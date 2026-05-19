import { createAppAuth } from '@nongyechuhai/auth';

export const { handlers, auth, signIn, signOut } = createAppAuth({
  allowedRoles: ['BUYER'],
  signInPath: '/login'
});