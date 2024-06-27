import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

// Dummy definition of sql for demonstration purposes
const sql = async <T>(queryTemplate: TemplateStringsArray, ...queryValues: any[]): Promise<{ rows: T[] }> => {
    console.log('Executing SQL query:', queryTemplate, queryValues);
        // Simulate a database response
        return {
            rows: [
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'hashedpassword',
                } as T,
            ],
        };
    };

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user');
    }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({
                    email: z.string().email(),
                    password: z.string().min(6),
                })
                .safeParse(credentials);

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                if (!user) return null;
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (passwordMatch) return user;
            }
            console.log('Invalid credentials');
            return null;
            },
            credentials: {
                email: {},
                password: {},
            }
        }),
    ],
});