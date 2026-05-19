import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@nongyechuhai/db';
import bcrypt from 'bcrypt';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export type AppRole = 'ADMIN' | 'SUPPLIER' | 'BUYER';

type CreateAppAuthOptions = {
  allowedRoles?: AppRole[];
  signInPath?: string;
};

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function hasAllowedRole(role: unknown, allowedRoles?: AppRole[]) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(role as AppRole);
}

export function createAppAuth(options: CreateAppAuthOptions = {}) {
  const { allowedRoles, signInPath = '/login' } = options;

  const authConfig: NextAuthConfig = {
    adapter: PrismaAdapter(prisma),
    session: {
      strategy: 'database'
    },
    trustHost: process.env.AUTH_TRUST_HOST !== 'false',
    pages: {
      signIn: signInPath
    },
    providers: [
      Credentials({
        name: 'Email and password',
        credentials: {
          email: {
            label: 'Email',
            type: 'email'
          },
          password: {
            label: 'Password',
            type: 'password'
          }
        },
        async authorize(rawCredentials) {
          const parsedCredentials = credentialsSchema.safeParse(rawCredentials);

          if (!parsedCredentials.success) {
            return null;
          }

          const email = parsedCredentials.data.email.toLowerCase();
          const user = await prisma.user.findUnique({
            where: {
              email
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              passwordHash: true
            }
          });

          if (!user || !user.passwordHash || user.status !== 'ACTIVE') {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            parsedCredentials.data.password,
            user.passwordHash
          );

          if (!isPasswordValid || !hasAllowedRole(user.role, allowedRoles)) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        }
      })
    ],
    callbacks: {
      signIn({ user }) {
        return hasAllowedRole((user as { role?: AppRole }).role, allowedRoles);
      },
      session({ session, user }) {
        if (session.user) {
          const sessionUser = session.user as typeof session.user & {
            id?: string;
            role?: AppRole;
          };

          sessionUser.id = user.id;
          sessionUser.role = (user as { role?: AppRole }).role ?? 'BUYER';
        }

        return session;
      }
    }
  };

  return NextAuth(authConfig);
}

export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'database'
  },
  providers: []
};

export function hasRole(role: AppRole | null | undefined, requiredRole: AppRole) {
  return role === requiredRole;
}
